var vertxTest = require("vertx_tests");
var vassert   = vertxTest.vassert;

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

vertxTest.startTests(this);
