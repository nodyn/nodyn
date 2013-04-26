var vertxTest = require('vertx_tests');
var vassert   = vertxTest.vassert;

// These mostly just test that the functions exist and are callable

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

function testConsoleWarn() {
  vassert.assertEquals('function', typeof console.info);
  console.warn('a warning message');
  vassert.testComplete();
}

function testConsoleError() {
  vassert.assertEquals('function', typeof console.info);
  console.error('an error message');
  vassert.testComplete();
}

function testConsoleTrace() {
  vassert.assertEquals('function', typeof console.info);
  console.trace('label');
  vassert.testComplete();
}

function testConsoleDir() {
  vassert.assertEquals('function', typeof console.info);
  console.dir(new Date());
  vassert.testComplete();
}

function testConsoleTime() {
  vassert.assertEquals('function', typeof console.info);
  console.time('LABEL');
  console.timeEnd('LABEL');
  vassert.testComplete();
}

function testConsoleEndTimeWithBadLabel() {
  vassert.assertEquals('function', typeof console.info);
  try {
    console.timeEnd('BAD LABEL');
    vassert.fail("console.timeEnd() with an unknown label should throw");
  } catch(e) {
  }
  vassert.testComplete();
}

function testConsoleAssert() {
  vassert.assertEquals('function', typeof console.info);
  console.assert(true, "you should not see this");
  vassert.testComplete();
}

function testConsoleAssertFails() {
  vassert.assertEquals('function', typeof console.info);
  try {
    console.assert(false, "EXPECTED");
    vassert.fail("console.assert(false) should throw");
  } catch(e) {
  }
  vassert.testComplete();
}

vertxTest.startTests(this);
