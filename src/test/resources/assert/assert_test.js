load("vertx_tests.js");
node_assert = require('assert');

function testAssertOK() {
  node_assert.ok(true);
  vassert.testComplete();
}

function testAssertFail() {
  try {
    node_assert.fail('actual', 'expected', 'message', null);
    vassert.fail("Node assert fail should throw.");
  } catch(e) {
  }
  vassert.testComplete();
}

initTests(this);
