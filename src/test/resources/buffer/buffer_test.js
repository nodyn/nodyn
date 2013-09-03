var vertxTest = require('vertx_tests');
var vassert   = vertxTest.vassert;

var Harness     = org.projectodd.nodyn.integration.IntegrationTests;
var TEST_STRING = Harness.TEST_STRING;
var UTF8_BYTES  = Harness.UTF8_BYTE_STRING;
var ASCII_BYTES = Harness.ASCII_BYTE_STRING;

var BufferTests = {
  testSafeConstructor: function() {
    var b = new Buffer(10);
    vassert.assertEquals(10, b.length);
    b[0] = -1;
    // Node.js expects numbers to be between 0 and 255
    vassert.assertEquals("255", "" + b[0]);
    vassert.testComplete();
  },

  testDefaultConstructor: function() {
    var b = new Buffer('cheezy bits');
    vassert.assertEquals('cheezy bits', b.toString());
    vassert.testComplete();
  },

  testDefaultConstructorWithEncoding: function() {
    var b = new Buffer('cheez', 'utf16le');
    vassert.assertEquals('cheez', b.toString());
    // TODO: Why does this test fail?
    //vassert.assertEquals('c\u0000h\u0000e\u0000e\u0000z\u0000', b.toString('utf16le'));
    vassert.testComplete();
  },

  testArrayConstructor: function() {
    var b = new Buffer(['b', 'a', 'c', 'o', 'n']);
    vassert.assertEquals(5, b.length);
    vassert.assertEquals("bacon", b.toString());
    vassert.testComplete();
  },

  testBufferWrite: function() {
    b = new Buffer(256);
    len = b.write('\u00bd + \u00bc = \u00be', 0);
    vassert.assertEquals("12", ""+len);
    vassert.assertEquals("9", ""+b._charsWritten);
    vassert.assertEquals('½ + ¼ = ¾', b.toString('utf8', 0, len));
    vassert.testComplete();
  },

  testBufferFill: function() {
    var b = new Buffer(4);
    b.fill(72, 0, 4);
    vassert.assertEquals(4, b.length);
    vassert.assertEquals("HHHH", b.toString());
    vassert.testComplete();
  },

  testBufferFillDefaultOffsetAndLength: function() {
    var b = new Buffer(4);
    b.fill(72);
    vassert.assertEquals(4, b.length);
    vassert.assertEquals("HHHH", b.toString());
    vassert.testComplete();
  },

  testBufferFillWithStringAndDefaultOffsetAndLength: function() {
    var b = new Buffer(4);
    b.fill('h');
    vassert.assertEquals(4, b.length);
    vassert.assertEquals("hhhh", b.toString());
    vassert.testComplete();
  },

  // TODO: Do we want to throw here? Node.js does, but not sure
  // if it's ideal, since vertx doesn't care about overfilling the 
  // buffer. Do/should programs depend on this behavior?
  DEFERREDtestBufferOverfull: function() {
    var b = new Buffer(4);
    try {
      b.fill(1, 0, 5);
      vassert.fail("Buffer.fill should throw");
    } catch(e) {
    }
    vassert.testComplete();
  },

  testSlowBufferIndexedAccess: function() {
    var b = new SlowBuffer(1024);
    vassert.assertEquals(1024, b.length);
    b[4] = 10;
    vassert.assertEquals("10", "" + b[4]);
    vassert.assertEquals(1024, b.length);
    vassert.testComplete();
  },

  testBufferIndexedAccess: function() {
    var b = new Buffer(40);
    vassert.assertEquals(40, b.length);
    b[0] = 10;
    b[1] = 20;
    b[2] = 30;
    b[3] = 40;
    vassert.assertEquals("10", "" + b[0]);
    vassert.assertEquals("20", "" + b[1]);
    vassert.assertEquals("30", "" + b[2]);
    vassert.assertEquals("40", "" + b[3]);
    vassert.testComplete();
  },

  testBufferSimpleByteLength: function() {
    vassert.assertEquals("" + Buffer.byteLength('monkeys'), "7");
    vassert.testComplete();
  },

  testBufferUnicodeByteLength: function() {
    var str = '\u00bd + \u00bc = \u00be';
    vassert.assertEquals("" + Buffer.byteLength(str, 'utf8'), "12");
    vassert.testComplete();
  },

  testBufferByteLengthTypeException: function() {
    try {
      Buffer.byteLength(8);
      vassert.fail("Buffer.byteLength should fail");
    } catch (e) {
    }
    vassert.testComplete();
  },

  testBufferCopy: function() {
    var source = new Buffer(4);
    var dest   = new Buffer(4);
    source.fill(72, 0, 3);
    vassert.assertEquals(2, source.copy(dest, 0, 0, 2));
    vassert.assertEquals("HH", dest.toString());
    vassert.testComplete();
  },

  testBufferCopyZeroBytes: function() {
    var source = new Buffer(4);
    var dest   = new Buffer(4);
    source.fill(72, 0, 3);
    vassert.assertEquals(0, source.copy(dest, 0, 4, 4));
    vassert.assertEquals("", dest.toString());
    vassert.testComplete();
  },

  testBufferCopyWithBadTargetStart: function() {
    // in node.js this would throw, but we can
    // just expand the buffer. should we? let's do.
    var source = new Buffer(4);
    var dest   = new Buffer(4);
    source.fill(72, 0, 3);
    vassert.assertEquals(2, source.copy(dest, 4, 0, 2));
    vassert.assertEquals(6, dest.length);
    vassert.testComplete();
  },

  testBufferCopyWithBadSourceStartLength: function() {
    var source = new Buffer(4);
    var dest   = new Buffer(4);
    source.fill(72, 0, 3);
    try {
      vassert.assertEquals(0, source.copy(dest, 0, 6, 8));
      vassert.fail("Copying should throw an exception");
    } catch(e) {
    }
    vassert.testComplete();
  },

  testBufferCopyTypeError: function() {
    try {
      var source = new Buffer(4);
      source.copy(1,2,3,4);
      vassert.fail("Copying should throw an exception");
    } catch(e) {
    }
    vassert.testComplete();
  },

  testBufferUtf8Write: function() {
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
  },

  testBufferUtf8WriteWithOffset: function() {
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
  },

  testBufferUtf8WriteWithMaxLength: function() {
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
  },

  testBufferAsciiWrite: function() {
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
  },

  testBufferAsciiWriteWithOffset: function() {
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
  },

  testBufferAsciiWriteWithMaxLength: function() {
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
  },

  testBufferIsEncoding: function() {
    ['utf8', 'utf-8', 
     'ascii', 'us-ascii', 
     'ucf2', 'ucf-2', 'utf16le', 'utf-16le'].forEach( function(enc) {
      vassert.assertTrue(Buffer.isEncoding(enc));
    });
    var unsupported = ['foo', 'bar', 'taco'];
    ['foo', 'bar', 'taco'].forEach( function(enc) {
      vassert.assertFalse(Buffer.isEncoding(enc));
    });
    vassert.testComplete();
  },

  testBufferIsBuffer: function() {
    vassert.assertTrue(Buffer.isBuffer(new Buffer()));
    vassert.assertFalse(Buffer.isBuffer(new Array()));
    vassert.testComplete();
  },

  testBufferConcat: function() {
    var x = new Buffer(5);
    var y = new Buffer(5);
    x.fill("a");
    y.fill("b");
    var z = Buffer.concat([x,y]);
    vassert.assertEquals(10, z.length);
    vassert.assertEquals('aaaaabbbbb', z.toString());
    vassert.testComplete();
  },

  testBufferConcatOneItem: function() {
    var x = new Buffer(5);
    x.fill("a");
    var z = Buffer.concat([x]);
    vassert.assertEquals(x, z);
    vassert.testComplete();
  },

  testBufferConcatNullUndefEmptyList: function() {
    vassert.assertEquals(0, Buffer.concat(null).length);
    vassert.assertEquals(0, Buffer.concat(undefined).length);
    vassert.assertEquals(0, Buffer.concat([]).length);
    vassert.testComplete();
  },

  testReadUInt8: function() {
    var buff = new Buffer(3);
    buff[0] = 0x3;
    buff[1] = 0x23;
    buff[2] = 0x42;
    vassert.assertTrue(0x3 === buff.readUInt8(0));
    vassert.assertTrue(0x23 === buff.readUInt8(1));
    vassert.assertTrue(0x42 === buff.readUInt8(2));
    vassert.testComplete();
  }
}
vertxTest.startTests(BufferTests);
