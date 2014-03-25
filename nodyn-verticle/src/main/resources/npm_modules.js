/**
 *  Copyright 2014 Lance Ball
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *  http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */
// Since we intend to use the Function constructor.
/* jshint evil: true */
(function() {
  // Keep a reference to DynJS's builtin require()
  NativeRequire = { require: require };

  var System  = java.lang.System,
      Scanner = java.util.Scanner,
      File    = java.io.File;

  function Module(id, parent) {
    this.id = id;
    this.exports = {};
    this.parent = parent;
    this.children = [];
    this.filename = id;
    this.loaded = false;
    var self = this;
    
    if (self.parent && self.parent.children) {
      self.parent.children.push(self);
    }

    self.require = function(id) {
      return Require(id, self);
    };
  }

  Module._load = function(module) {
    if (module.loaded) return;
    var body   = readFile(module.filename),
        dir    = new File(module.filename).getParent(),
        args   = ['exports', 'module', 'require', '__filename', '__dirname'],
        func   = new Function(args, body);
    func.apply(module, 
        [module.exports, module, module.require, module.filename, dir]);
    module.loaded = true;
  };

  function Require(id, parent) {
    var file = Require.resolve(id, parent);

    if (!file) {
      if (typeof NativeRequire.require === 'function') {
        var native = NativeRequire.require(id);
        if (native) return native;
      }
      throw new ModuleError("Cannot find module " + id, "MODULE_NOT_FOUND");
    }

    try {
      if (Require.cache[file]) {
        return Require.cache[file];
      } else if (file.endsWith('.js')) { 
        return loadModule(file, parent);
      } else if (file.endsWith('.json')) {
        return loadJSON(file);
      }
    } catch(ex) {
      throw new ModuleError("Cannot load module: " + ex, "LOAD_ERROR");
    }
  }

  Require.resolve = function(id, parent) {
    var root = findRoot(parent);
    return resolveAsFile(id, root, '.js') || 
      resolveAsFile(id, root, '.json') || 
      resolveAsDirectory(id, root) ||
      resolveAsNodeModule(id, root);
  };

  Require.root = System.getProperty('user.dir');
  Require.cache = {};
  Require.extensions = {};
  require = Require;

  function loadModule(file, parent) {
    var module = new Module(file, parent);
    // prime the cache in order to support cyclic dependencies
    Require.cache[module.filename] = module.exports;
    Module._load(module);
    Require.cache[module.filename] = module.exports;
    return module.exports;
  }

  function loadJSON(file) {
    var json = JSON.parse(readFile(file));
    Require.cache[file] = json;
    return json;
  }

  function resolveAsNodeModule(id, root) {
    var base = [root, 'node_modules'].join('/');
    return resolveAsFile(id, base) ||
      resolveAsDirectory(id, base) ||
      ((root != Require.root) ? 
       resolveAsNodeModule(id, new File(root).getParent()) : 
       false);
  }

  function resolveAsDirectory(id, root) {
    var base = [root, id].join('/'),
        file = new File([base, 'package.json'].join('/'));
    if (file.exists()) {
      try {
        var body = readFile(file.getCanonicalPath()),
            package  = JSON.parse(body);
        return resolveAsFile(package.main || 'index.js', base);
      } catch(ex) {
        throw new ModuleError("Cannot load JSON file: " + ex, "PARSE_ERROR");
      }
    }
    return resolveAsFile('index.js', base);
  }

  function resolveAsFile(id, root, ext) {
    var file = new File([root, normalizeName(id, ext || '.js')].join('/'));
    if (file.exists()) {
      return file.getCanonicalPath();
    }
  }

  function normalizeName(fileName, ext) {
    var extension = ext || '.js';
    if (fileName.endsWith(extension)) {
      return fileName;
    }
    return fileName + extension;
  }

  function findRoot(parent) {
    if (!parent || !parent.id) { return Require.root; }
    var pathParts = parent.id.split('/');
    pathParts.pop();
    return pathParts.join('/');
  }

  function readFile(filename) {
    try {
      // TODO: I think this is not very efficient
      return new Scanner(new File(filename)).useDelimiter("\\A").next();
    } catch(e) {
      throw new ModuleError("Cannot read file ["+file+"]: " + e, "IO_ERROR");
    }
  }

  function ModuleError(message, code) {
    this.code = code || "UNDEFINED";
    this.message = message || "Error loading module";
  }

  // Helper function until ECMAScript 6 is complete
  if (typeof String.prototype.endsWith !== 'function') {
    String.prototype.endsWith = function(suffix) {
      if (!suffix) return false;
      return this.indexOf(suffix, this.length - suffix.length) !== -1;
    };
  }

  ModuleError.prototype = new Error();
  ModuleError.prototype.constructor = ModuleError;
}());

