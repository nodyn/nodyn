var vertxTest = require("vertx_tests");
var vassert   = vertxTest.vassert;

function testGlobal() {
  vassert.assertEquals('object', typeof global);
  vassert.testComplete();
}

function testProcess() {
  vassert.assertEquals('object', typeof global.process);
  vassert.assertEquals('object', typeof process);
  vassert.testComplete();
}

function testConsole() {
  vassert.assertEquals('object', typeof global.console);
  vassert.assertEquals('object', typeof console);
  vassert.testComplete();
}

function testRequire() {
  vassert.assertEquals('function', typeof global.require);
  vassert.assertEquals('function', typeof require);
  // TODO: This needs to be added...
  //vassert.assertEquals('function', typeof require.resolve);
  //vassert.assertEquals('object', typeof require.cache);
  //vassert.assertEquals('object', typeof require.extensions);
  vassert.testComplete();
}

function test__filename() {
  vassert.assertEquals('string', typeof __filename);
  vassert.assertEquals('globals_test.js', __filename);
  // TODO: __filename should be local to each commonjs module
  // TODO: Do we bother with __dirname since we're usually 
  // running from a jar file?
  vassert.testComplete();
}

vertxTest.startTests(this);

