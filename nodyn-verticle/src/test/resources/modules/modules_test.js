var vertxTest = require("vertx_tests");
var vassert   = vertxTest.vassert;

var ModulesTest = {
  testSetsLoadPath: function() {
    vassert.assertTrue(require.paths.indexOf(java.lang.System.getProperty('user.dir') + "/node_modules") >= 0);
    vassert.assertTrue(require.paths.indexOf(java.lang.System.getProperty('user.home') + "/node_modules") >= 0);
    vassert.assertTrue(require.paths.indexOf(java.lang.System.getProperty('user.home') + "/.node_modules") >= 0);
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
require.addLoadPath(java.lang.System.getProperty('user.dir') + "/src/test/resources/modules");
vertxTest.startTests(ModulesTest);


