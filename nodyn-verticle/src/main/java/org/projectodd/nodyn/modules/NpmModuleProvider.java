package org.projectodd.nodyn.modules;

import org.dynjs.exception.ThrowException;
import org.dynjs.runtime.*;
import org.dynjs.runtime.builtins.Require;
import org.dynjs.runtime.modules.FilesystemModuleProvider;
import org.projectodd.nodyn.process.Process;
import org.vertx.java.core.json.JsonObject;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.util.LinkedList;
import java.util.List;
import java.util.Scanner;

import static org.apache.commons.lang3.StringUtils.isNotBlank;
import static org.apache.commons.lang3.SystemUtils.*;

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

    private static final String NODE_MODULES = "node_modules";

    private Require require;
    private GlobalObject globalObject;

    public NpmModuleProvider(GlobalObject globalObject) {
        this.globalObject = globalObject;
        require = (Require) globalObject.get("require");
        if (require != null) {
            // global npm modules

            // Ideally the Process instance should be injected, easier testing
            if (new Process().isWindows()) {
                String appdata = System.getenv("APPDATA");
                if (isNotBlank(appdata)) {
                    require.pushLoadPath((appdata + FILE_SEPARATOR + "npm"
                            + FILE_SEPARATOR + NODE_MODULES).replace(File.separatorChar, '/'));
                }
            } else {
                require.pushLoadPath("/usr/local/lib/" + NODE_MODULES);
            }

            // npm modules in $HOME
            require.pushLoadPath((USER_HOME + FILE_SEPARATOR + "." + NODE_MODULES).replace(File.separatorChar, '/'));
            require.pushLoadPath((USER_HOME + FILE_SEPARATOR + NODE_MODULES).replace(File.separatorChar, '/'));

            // npm modules in cwd
            require.pushLoadPath((USER_DIR + FILE_SEPARATOR + NODE_MODULES).replace(File.separatorChar, '/'));

            // Inform dynjs that we exist
            require.addModuleProvider(this);
        } else {
            System.err.println("Can't find require() function");
        }
    }

    @Override
    protected boolean load(ExecutionContext context, String moduleID) {
        File file = new File(moduleID);
        if (file.exists()) {
            Runner runner    = context.getGlobalObject().getRuntime().newRunner().withContext(context);
            DynObject module = (DynObject) runner.withContext(context).withSource("module").evaluate();

            // Node also looks for .json files and will load those as well
            // http://nodejs.org/api/modules.html#modules_file_modules
            if (file.getName().endsWith(".json")) {
                module.put("exports", runner.withSource("require.loadJSON('" + file.getAbsolutePath() + "');").evaluate());
                return true;
            }
            List<String> pathsToRoot = getLoadPathsToRoot(file.getParent());
            for (String path : pathsToRoot) {
                require.pushLoadPath(path.replace(File.separatorChar, '/'));
            }
            module.put("filename", file.getName());
            module.put("loaded", false);
            require.pushLoadPath(file.getParent().replace(File.separatorChar, '/'));
            try {
                setMutableBinding(context, "__dirname", file.getParentFile().getCanonicalPath());
                runner.withContext(context).withSource(file).execute();
                module.put("loaded", true);
                return true;
            } catch (Exception e) {
                System.err.println("ERROR: Error loading module " + moduleID);
                System.err.println("ERROR: " + e.getMessage());
                setMutableBinding(context, "__exception", e);
            } finally {
                require.removeLoadPath(file.getParent().replace(File.separatorChar, '/'));
                for (String path : pathsToRoot) {
                    require.removeLoadPath(path.replace(File.separatorChar, '/'));
                }
            }
        }
        return false;
    }


    @Override
    protected File findFile(List<String> loadPaths, String moduleName) {
        String fileName;
        if (moduleName.endsWith(".js") || moduleName.endsWith(".json")) {
            fileName = moduleName;
        } else {
            fileName = moduleName + ".js";
        }

        File file = null;
        for (String loadPath : loadPaths) {
            file = new File(loadPath, fileName);
            if (file.exists()) {
                return file;
            }
            // moduleName.js/json wasn't found as a file. Look for a directory instead.
            // http://nodejs.org/api/modules.html#modules_folders_as_modules
            // first check to see if there is a package.json in the directory
            File pkg = new File(loadPath + "/" + moduleName, "package.json");
            if (pkg.exists()) {
                // load the JSON and find the main module file to consider
                try {
                    String jsonString = new Scanner(pkg).useDelimiter("\\A").next();
                    JsonObject jsonObject = new JsonObject(jsonString);

                    // If there is no main in package.json, default to index.js
                    String moduleMain = jsonObject.getString("main", "index.js");

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
            list.push(parent.getAbsolutePath() + File.separatorChar + "node_modules");
            parent = parent.getParentFile();
        }
        return list;
    }
}

