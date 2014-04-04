var helper    = require('specHelper');
var timer     = require('vertx/timer');

describe("The timers module", function() {

  it('should pass testSetTimeout', function() {
    var x = 0;
    waitsFor(helper.testComplete, "the setTimeout test to complete", 3);
    setTimeout(function() {
      x = x+1;
    }, 1);
    timer.setTimer(10, function() {
      expect(x).toBe(1);
      helper.testComplete(true);
    });
  });

  it('should pass testSetTimeoutWaits', function() {
    var x = 0;
    waitsFor(helper.testComplete, "the setTimeoutWaits test to complete", 3);
    setTimeout(function() {
      x = x+1;
    }, 100);
    timer.setTimer(200, function() {
      expect(x).toBe(1);
      helper.testComplete(true);
    });
  });

  it('should pass testSetTimeoutPassesArgs', function() {
    var x = 0;
    waitsFor(helper.testComplete, "the setTimeoutPassesArgs test to complete", 3);
    setTimeout(function(y, z) { 
      x = z+y;
    }, 1, 5, 45);
    timer.setTimer(100, function() {
      expect(x).toBe(50);
      helper.testComplete(true);
    });
  });

  it('should pass testClearTimeout', function() {
    var x = 0;
    waitsFor(helper.testComplete, "the clearTimeout test to complete", 3);
    var timerId = setTimeout(function(y) { 
      x = x+y;
    }, 200, 5);
    clearTimeout(timerId);
    timer.setTimer(200, function() {
      expect(x).toBe(0);
      helper.testComplete(true);
    });
  });

  it('should pass testSetInterval', function() {
    var x = 0;
    waitsFor(helper.testComplete, "the setInterval test to complete", 3);
    var id = setInterval(function() {
      x = x+1;
    }, 10);
    timer.setTimer(150, function() {
      expect(x).toBeGreaterThan(1);
      clearInterval(id);
      helper.testComplete(true);
    });
  });

  it('should pass testClearInterval', function() {
    var x = 0;
    waitsFor(helper.testComplete, "the clearInterval test to complete", 3);
    var id = setInterval(function() {
      x = x+1;
    }, 500);
    clearInterval(id);
    timer.setTimer(100, function() {
      expect(x).toBe(0);
      helper.testComplete(true);
    });
  });

  beforeEach(function() {
    helper.testComplete(false);
  });

});
