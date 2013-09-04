var vertxTest = require("vertx_tests");
var vassert   = vertxTest.vassert;

assert = require('assert');

var AssertTest = {
  testAssertFail: function() {
    try {
      assert.fail('actual', 'expected', 'message', '=');
      vassert.fail("Node assert fail should throw.");
    } catch(e) {
      vassert.assertTrue(e instanceof assert.AssertionError);
      vassert.assertEquals('message', e.message);
      vassert.assertEquals('actual', e.actual);
      vassert.assertEquals('expected', e.expected);
      vassert.assertEquals('=', e.operator);
    }
    vassert.testComplete();
  },

  testAssertOK: function() {
    assert.ok(true);
    try {
      assert.ok(false, 'a message');
    } catch(err) {
      vassert.assertEquals('a message', err.message);
    }
    vassert.testComplete();
  },

  testAssert: function() {
    assert(true);
    try {
      assert(false, 'a message');
    } catch(err) {
      vassert.assertEquals('a message', err.message);
    }
    vassert.testComplete();
  },

  testAssertEqual: function() {
    assert.equal('1', '1');
    try {
      assert.equal('1', '2');
    } catch(err) {
      vassert.assertEquals('"1" == "2"', err.message);
    }
    vassert.testComplete();
  },

  testAssertNotEqual: function() {
    assert.notEqual('1', '2');
    try {
      assert.notEqual('1', '1');
    } catch(err) {
      vassert.assertEquals('"1" != "1"', err.message);
    }
    vassert.testComplete();
  }
}


vertxTest.startTests(AssertTest);
