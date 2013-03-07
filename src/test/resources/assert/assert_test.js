load("vertx.js");
load("vertx_tests.js");

function testAssertOK() {
  node_assert = require('assert');
  vassert.assertEquals(node_assert.ok(true), true);
  vassert.assertEquals(node_assert.ok(false), false);
  vassert.testComplete();
}
var script = this;
var nodeConfig = {};
vertx.deployModule(java.lang.System.getProperty("vertx.modulename"), nodeConfig, 1, function() {
  initTests(script);
});

