package org.projectodd.nodyn.modules;

import org.dynjs.runtime.GlobalObject;
import org.dynjs.runtime.builtins.Require;
import org.dynjs.runtime.modules.FilesystemModuleProvider;
import org.vertx.java.core.json.JsonObject;

import java.io.File;
import java.io.FileNotFoundException;
import java.util.ArrayList;
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

    public NpmModuleProvider(GlobalObject globalObject) {
        super(globalObject);
        Require require = (Require) globalObject.get("require");
        if (require != null) {
            // global npm modules
            require.addLoadPath("/usr/local/lib/node/");
            require.addLoadPath("/usr/local/lib/node_modules");

            // npm modules in CWD up to root
            // http://nodejs.org/api/modules.html#modules_loading_from_node_modules_folders
            File parent = new File(System.getProperty("user.dir"));
            while (parent != null) {
                require.addLoadPath(parent.getAbsolutePath() + "/node_modules");
                parent = parent.getParentFile();
            }

            // npm modules in $HOME
            require.addLoadPath(System.getProperty("user.home") + "/node_modules");
            require.addLoadPath(System.getProperty("user.home") + "/.node_modules");
            require.addModuleProvider(this);
        } else {
            System.err.println("Can't find require() function");
        }
    }

    @Override
    protected File findFile(List<String> loadPaths, String moduleName) {

        // DynJS FileSystemModuleProvider#findFile will find moduleName.js
        // if it exists in require.paths
        File file = super.findFile(loadPaths, moduleName);
        if (file != null && file.exists()) { return file; }

        // moduleName.js wasn't found as a file. Look for a directory instead.
        // http://nodejs.org/api/modules.html#modules_folders_as_modules
        for (String loadPath : loadPaths) {

            // first check to see if there is a package.json in the directory
            File pkg = new File(loadPath + "/" + moduleName, "package.json");
            System.err.println("Looking for package: " + pkg.getAbsolutePath());
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
}

