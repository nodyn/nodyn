load("vertx.js");
load("vertx_tests.js");

java.lang.System.err.println("MODULE NAME: " + java.lang.System.getProperty("vertx.modulename"));

function testAssertOK() {
  node_assert = require('assert');
  vassert.assertEquals(node_assert.ok(true), true);
  vassert.assertEquals(node_assert.ok(false), false);
  vassert.testComplete();
}
//var script = this;
//var nodeConfig = {};
//vertx.deployModule("org.projectodd#nodej#0.1.1.SNAPSHOT", nodeConfig, 1, function() {
  initTests(this);
//});
// vertx.deployModule(java.lang.System.getProperty("vertx.modulename"), nodeConfig, 1, function() {
//   initTests(script);
// });

