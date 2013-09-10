package org.projectodd.nodyn.modules;

import org.dynjs.runtime.DynJS;
import org.dynjs.runtime.ExecutionContext;
import org.dynjs.runtime.GlobalObject;
import org.dynjs.runtime.builtins.Require;
import org.dynjs.runtime.modules.FilesystemModuleProvider;
import org.vertx.java.core.json.JsonObject;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.util.ArrayList;
import java.util.LinkedList;
import java.util.List;
import java.util.Scanner;

/**
 * Extends DynJS FilesystemModuleProvider to support Node.js Modules API
 * This module provider adds support specifically for loading from
 * node_modules folders and modules as folders.
 *
 * @see http://nodejs.org/api/modules.html
 * @see http://nodejs.org/api/modules.html#modules_loading_from_node_modules_folders
 * @see http://nodejs.org/api/modules.html#modules_folders_as_modules
 */
public class NpmModuleProvider extends FilesystemModuleProvider {

    private Require require;

    public NpmModuleProvider(GlobalObject globalObject) {
        super(globalObject);
        require = (Require) globalObject.get("require");
        if (require != null) {
            // global npm modules
            require.pushLoadPath("/usr/local/lib/node_modules");

            // npm modules in $HOME
            require.pushLoadPath(System.getProperty("user.home") + "/.node_modules");
            require.pushLoadPath(System.getProperty("user.home") + "/node_modules");

            // npm modules in cwd
            require.pushLoadPath(System.getProperty("user.dir") + "/node_modules");

            // Inform dynjs that we exist
            require.addModuleProvider(this);
        } else {
            System.err.println("Can't find require() function");
        }
    }

    @Override
    protected boolean load(DynJS runtime, ExecutionContext context, String moduleID) {
        File file = new File(moduleID);
        if (file.exists()) {
            List<String> pathsToRoot = getLoadPathsToRoot(file.getParent());
            for (String path: pathsToRoot) {
                runtime.evaluate("require.pushLoadPath('" + path + "')");
            }
            runtime.evaluate("require.pushLoadPath('" + file.getParent() + "')");
            try {
//                System.err.println("Loading: " + file.getAbsolutePath());
                runtime.newRunner().withContext(context).withSource(file).execute();
                return true;
            } catch (IOException e) {
                System.err.println("There was an error loading the module " + moduleID + ". Error message: " + e.getMessage());
            } finally {
                runtime.evaluate("require.removeLoadPath('" + file.getParent() + "')");
                for(String path: pathsToRoot) {
                    runtime.evaluate("require.removeLoadPath('" + path + "')");
                }
            }
        }
        return false;
    }


    @Override
    protected File findFile(List<String> loadPaths, String moduleName) {
        String fileName = normalizeName(moduleName);
        File file = null;

        for (String loadPath: loadPaths) {
//            System.err.println("Looking in " + loadPath + " for " + moduleName);
            file = new File(loadPath, fileName);
            if (file.exists()) { return file; }

            // moduleName.js wasn't found as a file. Look for a directory instead.
            // http://nodejs.org/api/modules.html#modules_folders_as_modules
            // first check to see if there is a package.json in the directory
            File pkg = new File(loadPath + "/" + moduleName, "package.json");
            if (pkg.exists()) {
                // load the JSON and find the main module file to consider
                try {
                    String jsonString = new Scanner(pkg).useDelimiter("\\A").next();
                    JsonObject jsonObject = new JsonObject(jsonString);
                    String moduleMain = jsonObject.getString("main");
                    return new File(loadPath + "/" + moduleName, normalizeName(moduleMain));
                } catch (FileNotFoundException e) {
                    System.err.println("Error loading " + pkg.getAbsolutePath());
                }
            } else {
                // The last thing we look for is index.js in the module path
                file = new File(loadPath + "/" + moduleName, "index.js");
                if (file.exists()) return file;
            }
        }
        return file;
    }

    // npm modules in CWD up to root
    // http://nodejs.org/api/modules.html#modules_loading_from_node_modules_folders
    private List<String> getLoadPathsToRoot(String currentDir) {
        LinkedList<String> list = new LinkedList<>();
        File parent = new File(currentDir);
        while (parent != null) {
            list.push(parent.getAbsolutePath() + "/node_modules");
            parent = parent.getParentFile();
        }
        return list;
    }
}

