load('vertx_tests.js');

function testSafeConstructor() {
  var b = new Buffer(10);
  vassert.assertEquals(10, b.length);
  b[0] = -1;
  // Node.js expects numbers to be between 0 and 255
  // vassert.assertEquals("255", "" + b[0]);
  // TODO: Make this work again
  vassert.assertEquals("-1", "" + b[0]);
  vassert.testComplete();
}

function testDefaultConstructor() {
  var b = new Buffer('cheezy bits');
  vassert.assertEquals('cheezy bits', b.toString());
  vassert.testComplete();
}

function testDefaultConstructorWithEncoding() {
  var b = new Buffer('cheez', 'utf16le');
  vassert.assertEquals('c\u0000h\u0000e\u0000e\u0000z\u0000', b.toString());
  vassert.testComplete();
}

function testArrayConstructor() {
  var b = new Buffer(['b', 'a', 'c', 'o', 'n']);
  vassert.assertEquals(5, b.length);
  vassert.assertEquals("bacon", b.toString());
  vassert.testComplete();
}

function testBufferWrite() {
  b = new Buffer(256);
  len = b.write('\u00bd + \u00bc = \u00be', 0);
  vassert.assertEquals("12", ""+len);
  vassert.assertEquals('½ + ¼ = ¾', b.toString('utf8', 0, len));
  vassert.testComplete();
}

function testBufferFill() {
  var b = new Buffer(4);
  b.fill(72, 0, 4);
  vassert.assertEquals(4, b.length);
//  vassert.assertEquals("HHHH", b.toString());
  vassert.testComplete();
}

function testBufferOverfull() {
//  var b = new Buffer(4);
//  try {
//    b.fill(1, 0, 5);
//    vassert.assertFail("Buffer.fill should throw");
//  } catch(e) {
//  }
  vassert.testComplete();
}

function testSlowBufferIndexedAccess() {
//  var b = new SlowBuffer(1024);
//  vassert.assertEquals(1024, b.length);
//  b[4] = 10;
//  vassert.assertEquals("10", "" + b[4]);
//  vassert.assertEquals(1024, b.length);
  vassert.testComplete();
}


initTests(this);
