load("vertx.js");
load("vertx_tests.js");
require('node');


function testAssertOK() {
//  node_assert = require('assert');
//  vassert.assertEquals(node_assert.ok(true), false);
//  vassert.assertEquals(node_assert.ok(false), false);
  vassert.testComplete();
}

initTests(this);

