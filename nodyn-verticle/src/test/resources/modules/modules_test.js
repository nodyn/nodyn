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
		vassert.assertTrue(require.paths.indexOf(appdata + fileSep + "npm"
				+ fileSep + "node_modules") >= 0);
	} else {
		vassert.assertTrue(require.paths.indexOf("/usr/local/lib/node_modules") >= 0);
	}
    vassert.assertTrue(require.paths.indexOf(userDir + fileSep + "node_modules") >= 0);
    vassert.assertTrue(require.paths.indexOf(userHome + fileSep + "node_modules") >= 0);
    vassert.assertTrue(require.paths.indexOf(userHome + fileSep + ".node_modules") >= 0);
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

}

require.addLoadPath(userDir + "/src/test/resources/modules");
vertxTest.startTests(ModulesTest);


