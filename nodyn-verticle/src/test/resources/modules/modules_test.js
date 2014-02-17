var vertxTest = require("vertx_tests");
var vassert   = vertxTest.vassert;
var System    = java.lang.System;
var userDir   = System.getProperty('user.dir');
var userHome  = System.getProperty('user.home');

var isWindows = process.platform === 'win32';
var fileSep   = System.getProperty("file.separator");

require.root  = userDir + "/src/test/resources/modules";

var ModulesTest = {
//  testSetsLoadPath: function() {
//	if(isWindows) {
//		appdata = System.getenv("APPDATA");
//		vassert.assertTrue(require.paths.indexOf(appdata + fileSep + "npm" + fileSep + "node_modules") >= 0);
//	} else {
//		vassert.assertTrue(require.paths.indexOf("/usr/local/lib/node_modules") >= 0);
//	}
 //   vassert.assertTrue(require.paths.indexOf(userDir + fileSep + "node_modules") >= 0);
  //  vassert.assertTrue(require.paths.indexOf(userHome + fileSep + "node_modules") >= 0);
   // vassert.assertTrue(require.paths.indexOf(userHome + fileSep + ".node_modules") >= 0);
    //vassert.testComplete();
//  },

  testHas__dirname: function() {
    var dir = new java.io.File('./src/test/resources/modules/somemodule/lib').getCanonicalPath();
    var subdir = new java.io.File('./src/test/resources/modules/somemodule/lib/subdir').getCanonicalPath();
    var mod = require('somemodule');
    vassert.assertTrue(mod.dirname !== null);
    vassert.assertTrue(mod.dirname !== undefined);
    vassert.assertEquals(dir, mod.dirname);
    vassert.assertEquals(subdir, mod.subdir);
    vassert.testComplete();
  },

  testFindsModuleIndexDotJs: function() {
    var mod = require('amodule');
    vassert.assertEquals("nacho cheese", mod.flavor);
    vassert.testComplete();
  },

  testFindsModulePackageDotJson: function() {
    var mod = require('somemodule');
    vassert.assertEquals("cool ranch", mod.flavor);
    vassert.testComplete();
  },

  testFindsAndLoadsJsonFiles: function() {
    json = require('./conf.json');
    vassert.assertTrue("somevalue" === json.somekey);
    vassert.testComplete();
  },

  testModuleObjectProperties: function() {
    assertProperties(require('parent'), require.root + '/properties.js');
    vassert.testComplete();
  },

  testModulesLoadedFromDefineGetter: function() {
    var mod = require('defineGetter');
    assertProperties(mod.props, require.root + '/properties.js');
    vassert.testComplete();
  },

};

function assertProperties(mod, filename) {
  vassert.assertTrue("Module should have a string ID", 
      (typeof mod.id === 'string'));
  vassert.assertTrue("Module should have a filename. Got: " + mod.filename, 
      (mod.filename === filename));
  vassert.assertTrue("Module should have a loaded property", 
      (typeof mod.loaded === 'boolean'));
  vassert.assertTrue("Module should have a parent", 
      (typeof mod.parent === 'object'));
  vassert.assertTrue("Module should have a parent filename",
      (typeof mod.parent.filename === 'string'));
  vassert.assertTrue("Module should have children", 
      (typeof mod.children === 'object'));
}

vertxTest.startTests(ModulesTest);


