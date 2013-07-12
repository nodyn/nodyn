var vertxTest = require('vertx_tests');
var vassert   = vertxTest.vassert;

// These mostly just test that the functions exist and are callable

var ConsoleTests = {
  testConsoleLog: function() {
    vassert.assertEquals('function', typeof console.log);
    console.log('a log message');
    vassert.testComplete();
  },

  testConsoleInfo: function() {
    vassert.assertEquals('function', typeof console.info);
    console.info('an info message');
    vassert.testComplete();
  },

  testConsoleWarn: function() {
    vassert.assertEquals('function', typeof console.info);
    console.warn('a warning message');
    vassert.testComplete();
  },

  testConsoleError: function() {
    vassert.assertEquals('function', typeof console.info);
    console.error('an error message');
    vassert.testComplete();
  },

  testConsoleTrace: function() {
    vassert.assertEquals('function', typeof console.info);
    console.trace('label');
    vassert.testComplete();
  },

  testConsoleDir: function() {
    vassert.assertEquals('function', typeof console.info);
    console.dir(new Date());
    vassert.testComplete();
  },

  testConsoleTime: function() {
    vassert.assertEquals('function', typeof console.info);
    console.time('LABEL');
    console.timeEnd('LABEL');
    vassert.testComplete();
  },

  testConsoleEndTimeWithBadLabel: function() {
    vassert.assertEquals('function', typeof console.info);
    try {
      console.timeEnd('BAD LABEL');
      vassert.fail("console.timeEnd() with an unknown label should throw");
    } catch(e) {
    }
    vassert.testComplete();
  },

  testConsoleAssert: function() {
    vassert.assertEquals('function', typeof console.info);
    console.assert(true, "you should not see this");
    vassert.testComplete();
  },

  testConsoleAssertFails: function() {
    vassert.assertEquals('function', typeof console.info);
    try {
      console.assert(false, "EXPECTED");
      vassert.fail("console.assert(false) should throw");
    } catch(e) {
    }
    vassert.testComplete();
  }
}
vertxTest.startTests(ConsoleTests);
