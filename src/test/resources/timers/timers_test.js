var vertxTest = require('vertx_tests');
var vassert   = vertxTest.vassert;
var timer     = require('vertx/timer');

var TimersTests = {
  testSetTimeout: function() {
    var x = 0;
    setTimeout(function() {
      x = x+1;
    }, 1);
    timer.setTimer(10, function() {
      vassert.assertEquals(1, x);
      vassert.testComplete();
    });
  },

  testSetTimeoutWaits: function() {
    var x = 0;
    setTimeout(function() {
      x = x+1;
    }, 100);
    vassert.assertEquals(0, x);
    timer.setTimer(200, function() {
      vassert.assertEquals(1, x);
      vassert.testComplete();
    });
  },

  testSetTimeoutPassesArgs: function() {
    var x = 0;
    setTimeout(function(y, z) { 
      x = z+y;
    }, 1, 5, 45);
    timer.setTimer(1, function() {
      vassert.assertEquals(50, x);
      vassert.testComplete();
    });
  },

  testClearTimeout: function() {
    var x = 0;
    var timerId = setTimeout(function(y) { 
      x = x+y;
    }, 200, 5);
    clearTimeout(timerId);
    timer.setTimer(200, function() {
      vassert.assertEquals(0, x);
      vassert.testComplete();
    });
  },

  testSetInterval: function() {
    var x = 0;
    setInterval(function() {
      x = x+1;
    }, 10);
    timer.setTimer(100, function() {
      vassert.assertTrue(x>1);
      vassert.testComplete();
    });
  },

  testClearInterval: function() {
    var x = 0;
    var id = setInterval(function() {
      x = x+1;
    }, 500);
    clearInterval(id);
    timer.setTimer(100, function() {
      vassert.assertEquals(0, x);
      vassert.testComplete();
    });
  }
}
vertxTest.startTests(TimersTests);
