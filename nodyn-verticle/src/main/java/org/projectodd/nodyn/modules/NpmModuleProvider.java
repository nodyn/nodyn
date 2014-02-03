package org.projectodd.nodyn.modules;

import org.dynjs.runtime.*;
import org.dynjs.runtime.builtins.Require;
import org.dynjs.runtime.modules.ModuleProvider;
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
public class NpmModuleProvider extends ModuleProvider {

    private static final String NODE_MODULES = "node_modules";
    private static final String DIRNAME = "__dirname";
    private final Require require;

    public NpmModuleProvider(Require require) {
        this.require = require;

        // setup global npm modules
        // Ideally the Process instance should be injected, easier testing
        if (new Process().isWindows()) {
            String appdata = System.getenv("APPDATA");
            if (isNotBlank(appdata)) {
                require.addLoadPath((appdata + FILE_SEPARATOR + "npm"
                        + FILE_SEPARATOR + NODE_MODULES).replace(File.separatorChar, '/'));
            }
        } else {
            // todo: this should be $NODE_PREFIX or some such
            require.addLoadPath("/usr/local/lib/" + NODE_MODULES);
        }

        // npm modules in $HOME
        require.addLoadPath((USER_HOME + FILE_SEPARATOR + "." + NODE_MODULES).replace(File.separatorChar, '/'));
        require.addLoadPath((USER_HOME + FILE_SEPARATOR + NODE_MODULES).replace(File.separatorChar, '/'));

        // npm modules in cwd
        require.addLoadPath((USER_DIR + FILE_SEPARATOR + NODE_MODULES).replace(File.separatorChar, '/'));

    }

    @Override
    public boolean load(ExecutionContext context, String moduleID) {
        File file = new File(moduleID);
        if (file.exists()) {
            final GlobalObject globalObject = context.getGlobalObject();
            Runner runner = globalObject.getRuntime().newRunner().withContext(context);
            DynObject module = (DynObject) ModuleProvider.getLocalVar(context, "module");

            // Node also looks for .json files and will load those as well
            // http://nodejs.org/api/modules.html#modules_file_modules
            if (file.getName().endsWith(".json")) {
                module.put("exports", runner.withSource("require.loadJSON('" + file.getAbsolutePath() + "');").evaluate());
                return true;
            }
            module.defineReadOnlyProperty(globalObject, "filename", file.getName());
            module.put("filename", file.getName());
            module.put("loaded", false);
            try {
                final String canonicalPath = file.getParentFile().getCanonicalPath();
                ModuleProvider.setLocalVar(context, DIRNAME, canonicalPath);
                runner.withContext(context).withSource(file).execute();
                module.put("loaded", true);
                return true;
            } catch (Error | IOException e) {
                System.err.println("ERROR: Error loading module " + moduleID);
                System.err.println("ERROR: " + e.getMessage());
                e.printStackTrace();
            }
        }
        return false;
    }

    // http://nodejs.org/api/modules.html#modules_all_together
    @Override
    public String generateModuleID(ExecutionContext context, String moduleName) {
        // FileSystemModuleProvider should handle loading the core modules
        String dirName = (String) ModuleProvider.getLocalVar(context.getParent(), DIRNAME);
        if (dirName == null) {
            dirName = System.getProperty("user.dir");
        }
        String moduleId;
        final String modulePath = dirName + FILE_SEPARATOR + moduleName;
        moduleId = resolveAsFile(modulePath);
        if (moduleId == null) {
            moduleId = resolveAsDirectory(modulePath);
        }
        if (moduleId == null) {
            moduleId = resolveNodeModules(dirName, moduleName);
        }
        return moduleId;
    }

    // http://nodejs.org/api/modules.html#modules_all_together
    private String resolveNodeModules(String dirName, String moduleName) {
        List<String> paths = getLoadPathsToRoot(dirName.replace(File.separatorChar, '/'));
        String moduleId = resolveNodeModulesFromPaths(paths, moduleName);
        if (moduleId == null) {
            moduleId = resolveNodeModulesFromPaths(require.getLoadPaths(), moduleName);
        }
        return moduleId;
    }

    private String resolveNodeModulesFromPaths(List<String> paths, String moduleName) {
        String moduleId;
        for (String path : paths) {
            final String modulePath = path + FILE_SEPARATOR + moduleName;
            moduleId = resolveAsFile(modulePath);
            if (moduleId != null) {
                return moduleId;
            } else {
                moduleId = resolveAsDirectory(modulePath);
                if (moduleId != null) {
                    return moduleId;
                }
            }
        }
        return null;
    }

    // http://nodejs.org/api/modules.html#modules_all_together
    private String resolveAsDirectory(String dirName) {
        File packageJson = new File(dirName, "package.json");
        String moduleId = null;
        if (packageJson.exists()) {
            try {
                // load the JSON and find the main module file to load
                String jsonString = new Scanner(packageJson).useDelimiter("\\A").next();
                JsonObject jsonObject = new JsonObject(jsonString);
                // If there is no main in package.json, default to index.js
                String moduleMain = jsonObject.getString("main", "index.js");
                return resolveAsFile(dirName + FILE_SEPARATOR + moduleMain);
            } catch (FileNotFoundException e) {
                // shouldn't get here
            }
        } else {
            moduleId = resolveAsFile(dirName + FILE_SEPARATOR + "index.js");
        }
        return moduleId;
    }

    // http://nodejs.org/api/modules.html#modules_all_together
    private String resolveAsFile(String moduleName) {
        final String fileName = moduleName.replace(File.separatorChar, '/');
        File file = new File(fileName);
        String moduleId = null;

        //System.err.println("Looking for: " + fileName);
        if (file.exists() && !file.isDirectory()) {
            moduleId = file.getAbsolutePath();
        } else {
            file = new File(fileName + ".js");
            if (file.exists()) {
                moduleId = file.getAbsolutePath();
            }
        }
        return moduleId;
    }

    // npm modules in CWD up to root
    // http://nodejs.org/api/modules.html#modules_loading_from_node_modules_folders
    // http://nodejs.org/api/modules.html#modules_all_together
    private List<String> getLoadPathsToRoot(String currentDir) {
        String rootName = "/";
        int rootIndex = currentDir.indexOf(NODE_MODULES);
        if (rootIndex != -1) {
            rootName = currentDir.substring(0, rootIndex);
        }
        File rootDir = new File(rootName);
        LinkedList<String> list = new LinkedList<>();
        File parent = new File(currentDir);

        while ((parent != null) && !parent.getAbsolutePath().equals(rootDir.getAbsolutePath())) {
            if (!parent.getName().equals(NODE_MODULES)) {
                final String pathname = (parent.getAbsolutePath() + FILE_SEPARATOR + NODE_MODULES).replace(File.separatorChar, '/');
                final File nodeModuleDir = new File(pathname);
                if (nodeModuleDir.exists()) {
                    list.push(nodeModuleDir.getAbsolutePath());
                }
            }
            parent = parent.getParentFile();
        }
        return list;
    }
}

