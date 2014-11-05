var helper    = require('./specHelper');

describe("The timers module", function() {

  beforeEach(function() {
    helper.testComplete(false);
  });

  it('should pass testSetTimeout', function() {
    var x = 0;
    waitsFor(helper.testComplete, "the setTimeout test to complete", 3000);
    setTimeout(function() {
      x = x+1;
    }, 10);
    setTimeout(function() {
      expect(x).toBe(1);
      helper.testComplete(true);
    }, 1000);
  });

  it('should pass testSetTimeoutWaits', function() {
    var x = 0;
    waitsFor(helper.testComplete, "the setTimeoutWaits test to complete", 3000);
    setTimeout(function() {
      x = x+1;
    }, 300);
    setTimeout(function() {
      expect(x).toBe(1);
      helper.testComplete(true);
    }, 2000);
  });

  it('should pass testSetTimeoutPassesArgs', function() {
    var x = 0;
    waitsFor(helper.testComplete, "the setTimeoutPassesArgs test to complete", 3000);
    setTimeout(function(y, z) {
      x = z+y;
    }, 1, 5, 45);
    setTimeout(function() {
      expect(x).toBe(50);
      helper.testComplete(true);
    }, 100);
  });

  it('should pass testClearTimeout', function() {
    var x = 0;
    waitsFor(helper.testComplete, "the clearTimeout test to complete", 3000);
    var timerId = setTimeout(function(y) {
      x = x+y;
    }, 200, 5);
    clearTimeout(timerId);
    setTimeout(function() {
      expect(x).toBe(0);
      helper.testComplete(true);
    }, 200);
  });

  it('should pass testSetInterval', function() {
    var x = 0;
    waitsFor(helper.testComplete, "the setInterval test to complete", 3000);
    var id = setInterval(function() {
      console.log( "interval fire: " + java.lang.Thread.currentThread() );
      x = x+1;
      console.log( "interval x=" + x );
    }, 300);
    setTimeout(function() {
      console.log( "timeout fire: " + java.lang.Thread.currentThread() );
      console.log( "timeout x=" + x );
      expect(x).toBeGreaterThan(1);
      clearInterval(id);
      helper.testComplete(true);
    }, 3000 );
  });

  it('should pass testClearInterval', function() {
    var x = 0;
    waitsFor(helper.testComplete, "the clearInterval test to complete", 3000);
    var id = setInterval(function() {
      x = x+1;
    }, 500);
    clearInterval(id);
    setTimeout(function() {
      expect(x).toBe(0);
      helper.testComplete(true);
    }, 100);
  });

  it('should return opaque timer thingies that can be ref/unrefed', function() {
    var x = 0;
    waitsFor(helper.testComplete, "the test to complete", 3000);
    var ref = setInterval(function() {
      x = x+1;
    }, 500);
    expect(ref.ref).toBeTruthy();
    expect(ref.unref).toBeTruthy();
    ref.unref();
    helper.testComplete(true);
  });

  it('should have a setImmediate function', function() {
    var x = 0;
    waitsFor(function() { return x === 2; }, 'the test to complete', 3000);
    setImmediate(function(y) {
      expect(x).toBe(0);
      expect(y).toBe(1);
      x = y;
    }, 1);
    setImmediate(function(z) {
      expect(x).toBe(1);
      expect(z).toBe(2);
      x = z;
    }, 2);
  });
});
