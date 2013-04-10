load('vertx_tests.js');

var SlowBuffer = process.binding('buffer').SlowBuffer;

function testSafeConstructor() {
  var b = new Buffer(10);
  vassert.assertEquals(10, b.length);
  b[0] = -1;
  // This is a stupid workaround to the fact that javascript
  // has no distinction between long and int. DynJS represents
  // numbers as Longs. So here, 255 is a Long. But Buffer is
  // a Java object and it's underlying byte array are a bunch
  // of ints. So this test fails if we don't stringify it.
  vassert.assertEquals("255", "" + b[0]);
  vassert.testComplete();
}

function testDefaultConstructor() {
  var b = new Buffer('cheezy bits');
  vassert.assertEquals('cheezy bits', b.toString());
  vassert.testComplete();
}

function testDefaultConstructorWithEncoding() {
  var b = new Buffer('cheezy bits', 'ascii');
  vassert.assertEquals('cheezy bits', b.toString());
  vassert.testComplete();
  // TODO: Figure out a better way to test this
}

function testArrayConstructor() {
  var b = new Buffer(['b', 'a', 'c', 'o', 'n']);
  vassert.assertEquals(5, b.length);
  vassert.assertEquals("bacon", b.toString());
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

function testMakeFastBuffer() {
  // TODO: really test this
  vassert.assertEquals('function', typeof SlowBuffer.makeFastBuffer);
  vassert.testComplete();
}

function testSlowBufferFill() {
  var b = new Buffer(4);
  b.fill(72, 0, 4);
  vassert.assertEquals(4, b.length);
  vassert.assertEquals("HHHH", b.toString());
  vassert.testComplete();
}

function testSlowBufferOverfull() {
  var b = new Buffer(4);
  try {
    b.fill(1, 0, 5);
    vassert.assertFail("Buffer.fill should throw");
  } catch(e) {
  }
  vassert.testComplete();
}

function testSlowBufferSimpleByteLength() {
  vassert.assertEquals("" + SlowBuffer.byteLength('monkeys'), "7");
  vassert.testComplete();
}

function testSlowBufferUnicodeByteLength() {
  var str = '\u00bd + \u00bc = \u00be';
  vassert.assertEquals("" + SlowBuffer.byteLength(str, 'utf8'), "12");
  vassert.testComplete();
}

function testSlowBufferByteLengthTypeException() {
  try {
    SlowBuffer.byteLength(8);
    vassert.assertFail("SlowBuffer.byteLength should fail");
  } catch (e) {
    vassert.assertTrue(e instanceof TypeError);
  }
  vassert.testComplete();
}

function testSlowBufferCopy() {
  var source = new SlowBuffer(4);
  var dest   = new SlowBuffer(4);
  source.fill(72, 0, 3);
  vassert.assertEquals(2, source.copy(dest, 0, 0, 2));
  vassert.assertEquals("HH", dest.toString());
  vassert.testComplete();
}

function testSlowBufferCopyZeroBytes() {
  var source = new SlowBuffer(4);
  var dest   = new SlowBuffer(4);
  source.fill(72, 0, 3);
  vassert.assertEquals(0, source.copy(dest, 0, 4, 4));
  vassert.assertEquals("", dest.toString());
  vassert.testComplete();
}

function testSlowBufferCopyWithBadTargetStart() {
  var source = new SlowBuffer(4);
  var dest   = new SlowBuffer(4);
  source.fill(72, 0, 3);
  try {
    vassert.assertEquals(0, source.copy(dest, 4, 0, 2));
    vassert.assertFail("Copying should throw an exception");
  } catch(e) {
  }
  vassert.testComplete();
}

function testSlowBufferCopyWithBadSourceStartLength() {
  var source = new SlowBuffer(4);
  var dest   = new SlowBuffer(4);
  source.fill(72, 0, 3);
  try {
    vassert.assertEquals(0, source.copy(dest, 0, 6, 8));
    vassert.assertFail("Copying should throw an exception");
  } catch(e) {
  }
  vassert.testComplete();
}

function testSlowBufferCopyTypeError() {
  try {
    var source = new SlowBuffer(4);
    source.copy(1,2,3,4);
    vassert.assertFail("Copying should throw an exception");
  } catch(e) {
    vassert.assertTrue(e instanceof TypeError);
  }
  vassert.testComplete();
}

initTests(this);
