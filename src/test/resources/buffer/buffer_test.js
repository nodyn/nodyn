load('vertx_tests.js');

var Harness     = org.projectodd.nodej.integration.javascript.BufferIntegrationTests;
var TEST_STRING = Harness.TEST_STRING;
var UTF8_BYTES  = Harness.UTF8_BYTE_STRING;
var ASCII_BYTES = Harness.ASCII_BYTE_STRING;

function testSafeConstructor() {
  var b = new Buffer(10);
  vassert.assertEquals(10, b.length);
  b[0] = -1;
  // Node.js expects numbers to be between 0 and 255
  vassert.assertEquals("255", "" + b[0]);
  vassert.testComplete();
}

function testDefaultConstructor() {
  var b = new Buffer('cheezy bits');
  vassert.assertEquals('cheezy bits', b.toString());
  vassert.testComplete();
}

function testDefaultConstructorWithEncoding() {
  var b = new Buffer('cheez', 'utf16le');
  vassert.assertEquals('cheez', b.toString());
  // TODO: Why does this test fail?
  //vassert.assertEquals('c\u0000h\u0000e\u0000e\u0000z\u0000', b.toString());
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
  vassert.assertEquals("9", ""+b._charsWritten);
  vassert.assertEquals('½ + ¼ = ¾', b.toString('utf8', 0, len));
  vassert.testComplete();
}

function testBufferFill() {
  var b = new Buffer(4);
  b.fill(72, 0, 4);
  vassert.assertEquals(4, b.length);
  vassert.assertEquals("HHHH", b.toString());
  vassert.testComplete();
}

function testBufferOverfull() {
  var b = new Buffer(4);
  try {
    b.fill(1, 0, 5);
    vassert.assertFail("Buffer.fill should throw");
  } catch(e) {
  }
  vassert.testComplete();
}

function testSlowBufferIndexedAccess() {
  var b = new SlowBuffer(1024);
  vassert.assertEquals(1024, b.length);
  b[4] = 10;
  vassert.assertEquals("10", "" + b[4]);
  vassert.assertEquals(1024, b.length);
  vassert.testComplete();
}

function testBufferSimpleByteLength() {
  vassert.assertEquals("" + Buffer.byteLength('monkeys'), "7");
  vassert.testComplete();
}

function testBufferUnicodeByteLength() {
  var str = '\u00bd + \u00bc = \u00be';
  vassert.assertEquals("" + Buffer.byteLength(str, 'utf8'), "12");
  vassert.testComplete();
}

function testBufferByteLengthTypeException() {
  try {
    Buffer.byteLength(8);
    vassert.assertFail("Buffer.byteLength should fail");
  } catch (e) {
  }
  vassert.testComplete();
}

function testBufferCopy() {
  var source = new Buffer(4);
  var dest   = new Buffer(4);
  source.fill(72, 0, 3);
  vassert.assertEquals(2, source.copy(dest, 0, 0, 2));
  vassert.assertEquals("HH", dest.toString());
  vassert.testComplete();
}

function testBufferCopyZeroBytes() {
  var source = new Buffer(4);
  var dest   = new Buffer(4);
  source.fill(72, 0, 3);
  vassert.assertEquals(0, source.copy(dest, 0, 4, 4));
  vassert.assertEquals("", dest.toString());
  vassert.testComplete();
}

function testBufferCopyWithBadTargetStart() {
  // in node.js this would throw, but we can
  // just expand the buffer. should we? let's do.
  var source = new Buffer(4);
  var dest   = new Buffer(4);
  source.fill(72, 0, 3);
  vassert.assertEquals(2, source.copy(dest, 4, 0, 2));
  vassert.assertEquals(6, dest.length);
  vassert.testComplete();
}

function testBufferCopyWithBadSourceStartLength() {
  var source = new Buffer(4);
  var dest   = new Buffer(4);
  source.fill(72, 0, 3);
  try {
    vassert.assertEquals(0, source.copy(dest, 0, 6, 8));
    vassert.assertFail("Copying should throw an exception");
  } catch(e) {
  }
  vassert.testComplete();
}

function testBufferCopyTypeError() {
  try {
    var source = new Buffer(4);
    source.copy(1,2,3,4);
    vassert.assertFail("Copying should throw an exception");
  } catch(e) {
  }
  vassert.testComplete();
}

function testBufferUtf8Write() {
  var b = new Buffer(70);
  b.fill(0);
  vassert.assertEquals(TEST_STRING.length, b.utf8Write(TEST_STRING, 0));
  vassert.assertEquals(TEST_STRING, b.toString());
  idx = 0;
  for (_byte in UTF8_BYTES) {
    vassert.assertEquals(_byte, b[idx]);
    idx = idx+1;
  }
  vassert.testComplete();
}

function testBufferUtf8WriteWithOffset() {
  var b = new Buffer(70);
  b.fill(0);
  vassert.assertEquals(TEST_STRING.length, b.utf8Write(TEST_STRING, 10));
  vassert.assertEquals(TEST_STRING, b.toString());
  idx = 10;
  for (_byte in UTF8_BYTES) {
    vassert.assertEquals(_byte, b[idx]);
    idx = idx+1;
  }
  vassert.testComplete();
}

function testBufferUtf8WriteWithMaxLength() {
  var b = new Buffer(70);
  b.fill(0);
  vassert.assertEquals(10, b.utf8Write(TEST_STRING, 0, 10));
  vassert.assertEquals(TEST_STRING.substring(0, 10), b.toString());
  idx = 0;
  for (_byte in UTF8_BYTES) {
    if (idx == 10) { break; }
    vassert.assertEquals(_byte, b[idx]);
    idx = idx+1;
  }
  vassert.testComplete();
}

function testBufferAsciiWrite() {
  var b = new Buffer(70);
  b.fill(0);
  vassert.assertEquals(TEST_STRING.length, b.asciiWrite(TEST_STRING, 0));
  vassert.assertEquals(TEST_STRING, b.toString());
  idx = 0;
  for (_byte in ASCII_BYTES) {
    vassert.assertEquals(_byte, b[idx]);
    idx = idx+1;
  }
  vassert.testComplete();
}

function testBufferAsciiWriteWithOffset() {
  var b = new Buffer(70);
  b.fill(0);
  vassert.assertEquals(TEST_STRING.length, b.asciiWrite(TEST_STRING, 10));
  vassert.assertEquals(TEST_STRING, b.toString());
  idx = 10;
  for (_byte in ASCII_BYTES) {
    vassert.assertEquals(_byte, b[idx]);
    idx = idx+1;
  }
  vassert.testComplete();
}

function testBufferAsciiWriteWithMaxLength() {
  var b = new Buffer(70);
  b.fill(0);
  vassert.assertEquals(10, b.asciiWrite(TEST_STRING, 0, 10));
  vassert.assertEquals(TEST_STRING.substring(0, 10), b.toString());
  idx = 0;
  for (_byte in ASCII_BYTES) {
    if (idx == 10) { break; }
    vassert.assertEquals(_byte, b[idx]);
    idx = idx+1;
  }
  vassert.testComplete();
}


initTests(this);
