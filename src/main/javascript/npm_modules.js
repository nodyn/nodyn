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
  NativeRequire = { require: typeof require === 'function' ?  require : load };

  var System  = java.lang.System,
      Scanner = java.util.Scanner,
      File    = java.io.File;

  function Module(id, parent, core) {
    this.id = id;
    this.core = core;
    this.parent = parent;
    this.children = [];
    this.filename = id;
    this.loaded = false;
    var self = this;
    
    Object.defineProperty( this, 'exports', {
      get: function() {
        return this._exports;
      }.bind(this),
      set: function(val) {
        Require.cache[this.filename] = val;
        this._exports = val;
      }.bind(this),
    } );
    this.exports = {};

    if (self.parent && self.parent.children) {
      self.parent.children.push(self);
    }

    self.require = function(id) {
      return Require(id, self);
    };
  }

  Module._load = function(module) {
    if (module.loaded) return;
    var body   = readFile(module.filename, module.core),
        dir    = new File(module.filename).getParent(),
        args   = ['exports', 'module', 'require', '__filename', '__dirname'],
        func   = new Function(args, body);
    func.apply(module, 
        [module.exports, module, module.require, module.filename, dir]);
    module.loaded = true;
  };

  function Require(id, parent) {
    var core, native, file = Require.resolve(id, parent);

    if (!file) {
      if (typeof NativeRequire.require === 'function') {
        if (Require.debug) {
          print(['Cannot resolve', id, 'defaulting to native'].join(' '));
        }
        native = NativeRequire.require(id);
        if (native) return native;
      }
      throw new ModuleError("Cannot find module " + id, "MODULE_NOT_FOUND");
    }

    if (file.core) {
      file = file.path;
      core = true;
    }
    try {
      if (Require.cache[file]) {
        return Require.cache[file];
      } else if (file.endsWith('.js')) { 
        return loadModule(file, parent, core);
      } else if (file.endsWith('.json')) {
        return loadJSON(file);
      }
    } catch(ex) {
      throw new ModuleError("Cannot load module", "LOAD_ERROR", ex);
    }
  }

  Require.resolve = function(id, parent) {
    var root = findRoot(parent);
    return resolveCoreModule(id, root) ||
      resolveAsFile(id, root, '.js')   || 
      resolveAsFile(id, root, '.json') || 
      resolveAsDirectory(id, root)     ||
      resolveAsNodeModule(id, root);
  };

  Require.root = System.getProperty('user.dir');

  Require.debug = false;
  Require.cache = {};
  Require.extensions = {};
  require = Require;

  function loadModule(file, parent, core) {
    var module = new Module(file, parent, core);
    Module._load(module);
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
        throw new ModuleError("Cannot load JSON file", "PARSE_ERROR", ex);
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

  function resolveCoreModule(id, root) {
    var name = normalizeName(id);
    var classloader = java.lang.Thread.currentThread().getContextClassLoader();
    if (classloader.findResource(name))
        return { path: name, core: true };
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

  function readFile(filename, core) {
    var input;
    try {
      if (core) {
        var classloader = java.lang.Thread.currentThread().getContextClassLoader();
        input = classloader.getResourceAsStream(filename);
      } else {
        input = new File(filename);
      }
      // TODO: I think this is not very efficient
      return new Scanner(input).useDelimiter("\\A").next();
    } catch(e) {
      throw new ModuleError("Cannot read file ["+input+"]: ", "IO_ERROR", e);
    }
  }

  function ModuleError(message, code, cause) {
    this.code = code || "UNDEFINED";
    this.message = message || "Error loading module";
    this.cause = cause;
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

