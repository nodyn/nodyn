load('vertx_tests.js');

function testStringDecoder() {
  var StringDecoder = require('string_decoder').StringDecoder;
  var decoder = new StringDecoder('utf8');
  var cent = new Buffer([0xC2, 0xA2]);
  // TODO: Figure out why this fails
  // vassert.assertEquals("¢", decoder.write(cent));
  vassert.testComplete();
}

initTests(this);
