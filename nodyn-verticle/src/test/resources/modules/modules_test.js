var vertxTest = require("vertx_tests");
var vassert   = vertxTest.vassert;
var System    = java.lang.System;
var userDir   = System.getProperty('user.dir');
var userHome  = System.getProperty('user.home');

var isWindows = process.platform === 'win32';
var fileSep   = System.getProperty("file.separator");

var ModulesTest = {
  testSetsLoadPath: function() {
	if(isWindows) {
		appdata = System.getenv("APPDATA");
		vassert.assertTrue(require.paths.indexOf(appdata + fileSep + "npm" + fileSep + "node_modules") >= 0);
	} else {
		vassert.assertTrue(require.paths.indexOf("/usr/local/lib/node_modules") >= 0);
	}
    vassert.assertTrue(require.paths.indexOf(userDir + fileSep + "node_modules") >= 0);
    vassert.assertTrue(require.paths.indexOf(userHome + fileSep + "node_modules") >= 0);
    vassert.assertTrue(require.paths.indexOf(userHome + fileSep + ".node_modules") >= 0);
    vassert.testComplete();
  },

  testHas__dirname: function() {
    var dir = new java.io.File('./src/test/resources/modules/somemodule/lib').getCanonicalPath();
    var mod = require('somemodule');
    vassert.assertTrue(mod.dirname !== null);
    vassert.assertTrue(mod.dirname !== undefined);
    vassert.assertEquals(dir, mod.dirname);
    vassert.testComplete();
  },

  testFindsModuleIndexDotJs: function() {
    mod = require('amodule');
    vassert.assertEquals(mod.flavor, "nacho cheese");
    vassert.testComplete();
  },

  testFindsModulePackageDotJson: function() {
    mod = require('somemodule');
    vassert.assertEquals(mod.flavor, "cool ranch");
    vassert.testComplete();
  },

  testFindsAndLoadsJsonFiles: function() {
    json = require('./conf.json');
    vassert.assertTrue("somevalue" === json.somekey);
    vassert.testComplete();
  },

  testModuleObjectProperties: function() {
    mod = require('properties');
    vassert.assertTrue("Module should have a string ID", typeof mod.id === 'string');
    vassert.assertTrue("Module should have a filename", mod.filename === 'properties.js');
    vassert.assertTrue("Module should have a loaded property", typeof mod.loaded === 'boolean');
//    vassert.assertTrue("Module should have a parent", typeof mod.parent === 'object');
    vassert.testComplete();
  }

};

require.addLoadPath(userDir + "/src/test/resources/modules");
vertxTest.startTests(ModulesTest);


