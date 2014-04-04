var helper = require('specHelper');

describe("The assert module", function() {
  var assert = require('assert');

  it('should testAssertFail', function() {
    try {
      assert.fail('actual', 'expected', 'message', '=');
      this.fail("Node assert fail should throw.");
    } catch(e) {
      expect(e instanceof assert.AssertionError).toBe(true);
      expect(e.message).toBe('message');
      expect(e.actual).toBe('actual');
      expect(e.expected).toBe('expected');
      expect(e.operator).toBe('=');
    }
  });

  it('should testAssertOK', function() {
    assert.ok(true);
    try {
      assert.ok(false, 'a message');
    } catch(err) {
      expect(err.message).toBe('a message');
    }
  });

  it('should testAssert', function() {
    assert(true);
    try {
      assert(false, 'a message');
    } catch(err) {
      expect(err.message).toBe('a message');
    }
  });

  it('should testAssertEqual', function() {
    assert.equal('1', '1');
    try {
      assert.equal('1', '2');
    } catch(err) {
      expect(err.message).toBe('"1" == "2"');
    }
  });

  it('should testAssertNotEqual', function() {
    assert.notEqual('1', '2');
    try {
      assert.notEqual('1', '1');
    } catch(err) {
      expect(err.message).toBe('"1" != "1"');
    }
  });
});

