var vertxTest = require('vertx_tests');
var vassert   = vertxTest.vassert;

var util = require('util');

var UtilTests = {
  testFormat: function() {
    vassert.assertEquals('1 2 3', util.format('1 2 3'));
    vassert.testComplete();
  },

  testDebug: function() {
    // only assures we don't fail - doesn't test the actual result
    util.debug('a debug message');
    vassert.testComplete();
  },

  testError: function() {
    // only assures we don't fail - doesn't test the actual result
    util.error('message to stderr', 'and', {})
    vassert.testComplete();
  },

  testPuts: function() {
    // only assures we don't fail - doesn't test the actual result
    util.puts('message to stdout', 'and', {})
    vassert.testComplete();
  },

  testPrint: function() {
    // only assures we don't fail - doesn't test the actual result
    util.print('message to stdout', 'and', {})
    vassert.testComplete();
  },

  testLog: function() {
    // only assures we don't fail - doesn't test the actual result
    util.log('message to log')
    vassert.testComplete();
  },

  testInspect: function() {
    // only assures we don't fail - doesn't test the actual result
    util.inspect(util, true, null)
    vassert.testComplete();
  },

  testIsArray: function() {
    vassert.assertTrue(util.isArray([]));
    vassert.assertTrue(util.isArray(new Array()));
    vassert.assertFalse(util.isArray({}));
    vassert.testComplete();
  },

  testIsRegExp: function() {
    vassert.assertTrue(util.isRegExp(/some regexp/));
    vassert.assertTrue(util.isRegExp(new RegExp('another regexp')));
    vassert.assertFalse(util.isRegExp({}));
    vassert.testComplete();
  },

  testIsError: function() {
    vassert.assertTrue(util.isError(new Error()));
    vassert.assertTrue(util.isError(new TypeError()));
    vassert.assertFalse(util.isError({ name: 'Error', message: 'an error occurred' }));
    vassert.testComplete();
  }
}
vertxTest.startTests(UtilTests);


