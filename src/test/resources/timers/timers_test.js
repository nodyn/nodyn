load('vertx_tests.js');

function testSetTimeout() {
  var x = 0;
  setTimeout(function() {
    x = x+1;
  }, 1);
  vertx.setTimer(10, function() {
    vassert.assertEquals(1, x);
    vassert.testComplete();
  });
}

function testSetTimeoutWaits() {
  var x = 0;
  setTimeout(function() {
    x = x+1;
  }, 100);
  vassert.assertEquals(0, x);
  vertx.setTimer(200, function() {
    vassert.assertEquals(1, x);
    vassert.testComplete();
  });
}

function testSetTimeoutPassesArgs() {
  var x = 0;
  setTimeout(function(y, z) { 
    x = z+y;
  }, 1, 5, 45);
  vertx.setTimer(1, function() {
    vassert.assertEquals(50, x);
    vassert.testComplete();
  });
}

function testClearTimeout() {
  var x = 0;
  var timerId = setTimeout(function(y) { 
    x = x+y;
  }, 200, 5);
  clearTimeout(timerId);
  vertx.setTimer(200, function() {
    vassert.assertEquals(0, x);
    vassert.testComplete();
  });
}

function testSetInterval() {
  var x = 0;
  setInterval(function() {
    x = x+1;
  }, 10);
  vertx.setTimer(100, function() {
    vassert.assertTrue(x>1);
    vassert.testComplete();
  });
}

function testClearInterval() {
  var x = 0;
  var id = setInterval(function() {
    x = x+1;
  }, 500);
  clearInterval(id);
  vertx.setTimer(100, function() {
    vassert.assertEquals(0, x);
    vassert.testComplete();
  });
}

initTests(this);
