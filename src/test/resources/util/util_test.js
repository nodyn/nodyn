load("vertx.js");
load("vertx_tests.js");

var util = require('util');


function testFormat() {
  vassert.assertEquals('1 2 3', util.format('1 2 3'));
  vassert.testComplete();
}

function testDebug() {
  // only assures we don't fail - doesn't test the actual result
  util.debug('a debug message');
  vassert.testComplete();
}

function testError() {
  // only assures we don't fail - doesn't test the actual result
  util.error('message to stderr', 'and', {})
  vassert.testComplete();
}

function testPuts() {
  // only assures we don't fail - doesn't test the actual result
  util.puts('message to stdout', 'and', {})
  vassert.testComplete();
}

function testPrint() {
  // only assures we don't fail - doesn't test the actual result
  util.print('message to stdout', 'and', {})
  vassert.testComplete();
}

function testLog() {
  // only assures we don't fail - doesn't test the actual result
  util.log('message to log')
  vassert.testComplete();
}

function testInspect() {
  // only assures we don't fail - doesn't test the actual result
  util.inspect(util, true, null)
  vassert.testComplete();
}

function testIsArray() {
  vassert.assertTrue(util.isArray([]));
  vassert.assertTrue(util.isArray(new Array()));
  vassert.assertFalse(util.isArray({}));
  vassert.testComplete();
}

function testIsRegExp() {
  vassert.assertTrue(util.isRegExp(/some regexp/));
  vassert.assertTrue(util.isRegExp(new RegExp('another regexp')));
  vassert.assertFalse(util.isRegExp({}));
  vassert.testComplete();
}

function testIsError() {
  vassert.assertTrue(util.isError(new Error()));
  vassert.assertTrue(util.isError(new TypeError()));
  vassert.assertFalse(util.isError({ name: 'Error', message: 'an error occurred' }));
  vassert.testComplete();
}

initTests(this);


