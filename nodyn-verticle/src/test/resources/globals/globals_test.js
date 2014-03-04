var vertxTest = require("vertx_tests");
var vassert   = vertxTest.vassert;

var GlobalsTests = {
  testGlobal: function() {
    vassert.assertEquals('object', typeof global);
    vassert.testComplete();
  },

  testProcess: function() {
    vassert.assertEquals('object', typeof global.process);
    vassert.assertEquals('object', typeof process);
    vassert.testComplete();
  },

  testConsole: function() {
    vassert.assertEquals('object', typeof global.console);
    vassert.assertEquals('object', typeof console);
    vassert.testComplete();
  },

  testRequire: function() {
    vassert.assertEquals('function', typeof global.require);
    vassert.assertEquals('function', typeof require);
    // TODO: This needs to be added...
    //vassert.assertEquals('function', typeof require.resolve);
    //vassert.assertEquals('object', typeof require.cache);
    //vassert.assertEquals('object', typeof require.extensions);
    vassert.testComplete();
  },

  test__filename: function() {
    vassert.assertEquals('string', typeof __filename);
    vassert.assertEquals('globals_test.js', __filename);
    vassert.testComplete();
  },

  test__dirname: function() {
    vassert.assertEquals('string', typeof __dirname);
    vassert.testComplete();
  }
};
vertxTest.startTests(GlobalsTests);

