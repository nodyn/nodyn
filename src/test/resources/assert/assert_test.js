load("vertx.js");
load("vertx_tests.js");

function testAssertOK() {
  node_assert = require('assert');
  node_assert.ok(true);
  vassert.testComplete();
}

initTests(this);
