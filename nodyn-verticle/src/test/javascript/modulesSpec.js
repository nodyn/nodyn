var helper = require('specHelper');

var System    = java.lang.System;
var userDir   = System.getProperty('user.dir');
var userHome  = System.getProperty('user.home');

var isWindows = process.platform === 'win32';
var fileSep   = System.getProperty("file.separator");

require.root  = userDir + "/src/test/javascript";

var matchers = {
  toHaveModuleProperties: function(properties_file) {
    var mod = this.actual;

    if ( (typeof mod.id) != 'string' ) {
      this.message = function(){ return 'Expected typeof mod.id to be "string" but was ' + ( typeof mod.id ); };
      return false;
    }

    if ( mod.filename !== properties_file ) {
      this.message = function(){ 'Expected mod.filename to be ' + properties_file + ", but was " + mod.filename; };
      return false;
    }

    if ( (typeof mod.loaded) != 'boolean' ) {
      this.message = function(){ return 'Expected typeof mod.loaded to be "boolean" but was ' + ( typeof mod.loaded ); };
      return false;
    }

    if ( (typeof mod.parent) != 'object' ) {
      this.message = function(){ return 'Expected typeof mod.parent to be "object" but was ' + ( typeof mod.parent ); };
      return false;
    }

    if ( (typeof mod.parent.filename) != 'string' ) {
      this.message = function(){ return 'Expected typeof mod.parent.filename to be "string" byt was ' + ( typeof mod.parent.filename ); };
      return false;
    }

    if ( (typeof mod.children) != 'object' ) {
      this.message = function(){ return 'Expected typeof mod.childrento be "object" byt was ' + ( typeof mod.children); };
      return false;
    }

    return true;
  }
};

describe( "modules", function() {

  beforeEach(function() {
    this.addMatchers( matchers );
    helper.testComplete(false);
  });

  it("should have mod.dirname", function() {
    var dir = new java.io.File('./src/test/javascript/somemodule/lib').getCanonicalPath();
    var subdir = new java.io.File('./src/test/javascript/somemodule/lib/subdir').getCanonicalPath();
    var mod = require('somemodule');
    expect(mod.dirname).not.toBe(null);
    expect(mod.dirname).not.toBe(undefined);
    expect(mod.dirname).toBe(dir);
    expect(mod.subdir).toBe(subdir);
    helper.testComplete(true);
  });

  it("should have locate module's index.js", function() {
    var mod = require('amodule');
    expect(mod.flavor).toBe("nacho cheese");
    helper.testComplete(true);
  });

  it("should find module's package.json", function() {
    var mod = require('somemodule');
    expect(mod.flavor).toBe("cool ranch");
    helper.testComplete(true);
  });

  it("should find an load json files", function() {
    json = require('./conf.json');
    expect(json.somekey).toBe("somevalue");
    helper.testComplete(true);
  });

  it("should have appropriate properties", function() {
    expect(require('parent')).toHaveModuleProperties(require.root + '/properties.js');
    helper.testComplete(true);
  });

  it("should properties loaded from define getter, whatever that means...", function() {
    expect(require('defineGetter').props).toHaveModuleProperties(require.root + '/properties.js');
    helper.testComplete(true);
  });

  it("should properly isolate", function() {
    require('module-isolation/module-a.js');
    try {
      var shouldThrow = EventEmitter;
      expect(false).toBe(true);
    } catch (err) {
      expect(err instanceof ReferenceError).toBe(true);
    }
    helper.testComplete(true);
  })

});
