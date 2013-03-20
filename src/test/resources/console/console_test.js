load('vertx_tests.js');

function testConsoleLog() {
  vassert.assertEquals('function', typeof console.log);
  console.log('a log message');
  vassert.testComplete();
}

function testConsoleInfo() {
  vassert.assertEquals('function', typeof console.info);
  console.info('an info message');
  vassert.testComplete();
}

initTests(this);

