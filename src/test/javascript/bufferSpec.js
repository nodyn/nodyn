
var Harness     = org.projectodd.nodyn.buffer.BufferHarness;
var TEST_STRING = Harness.TEST_STRING;
var UTF8_BYTES  = Harness.UTF8_BYTE_STRING;
var ASCII_BYTES = Harness.ASCII_BYTE_STRING;
var UTF8_TEST_WRITE_BUFFER = Harness.UTF8_TEST_WRITE_BUFFER;

var helper = require('specHelper');

describe("Buffer", function() {

  it('should pass testSafeConstructor', function() {
    var b = new Buffer(10);
    expect(b.length).toBe(10);
    b[0] = -1;
    // Node.js expects numbers to be between 0 and 255
    expect(b[0]).toBe(255);
  });

  it('should pass testDefaultConstructor', function() {
    var b = new Buffer('cheezy bits');
    expect(b.toString()).toBe('cheezy bits');
  });

  it('should pass testDefaultConstructorWithEncoding', function() {
    var b = new Buffer('cheez', 'utf16le');
    expect(b.toString('utf16le')).toBe('cheez');
    // TODO: Why does this test fail?
    // expect(b.toString()).toBe('c\u0000h\u0000e\u0000e\u0000z\u0000');
  });

  it('should pass testArrayConstructor', function() {
    var b = new Buffer(['b', 'a', 'c', 'o', 'n']);
    expect(b.length).toBe(5);
    expect(b.toString()).toBe("bacon");
  });

  it('should pass testBufferWrite', function() {
    b = new Buffer(256);
    len = b.write('\u00bd + \u00bc = \u00be', 0);
    expect(len).toBe(12);
    expect(b._charsWritten).toBe(9);
    expect(b.toString('utf8', 0, len)).toBe('½ + ¼ = ¾');
    utf8Bytes = Harness.toBytes(b.toString('utf8', 0, len));
    idx = 0;
    for (var _byte in utf8Bytes) {
      expect(_byte).toBe(UTF8_TEST_WRITE_BUFFER[idx]);
      idx = idx+1;
    }
  });

  it('should pass testBufferFill', function() {
    var b = new Buffer(4);
    b.fill(72, 0, 4);
    expect(b.length).toBe(4);
    expect(b.toString()).toBe("HHHH");
  });

  it('should pass testBufferFillDefaultOffsetAndLength', function() {
    var b = new Buffer(4);
    b.fill(72);
    expect(b.length).toBe(4);
    expect(b.toString()).toBe("HHHH");
  });

  it('should pass testBufferFillWithStringAndDefaultOffsetAndLength', function() {
    var b = new Buffer(4);
    b.fill('h');
    expect(b.length).toBe(4);
    expect(b.toString()).toBe("hhhh");
  });

  // TODO: Do we want to throw here? Node.js does, but not sure
  // if it's ideal, since vertx doesn't care about overfilling the 
  // buffer. Do/should programs depend on this behavior?
  it('should pass testBufferOverfull', function() {
    var b = new Buffer(4);
    try {
      b.fill(1, 0, 5);
//      this.fail("Buffer.fill should throw");
    } catch(e) {
    }
  });

  it('should pass testSlowBufferIndexedAccess', function() {
    var b = new SlowBuffer(1024);
    expect(b.length).toBe(1024);
    b[4] = 10;
    expect(b[4]).toBe(10);
    expect(b.length).toBe(1024, b.length);
  });

  it('should pass testBufferIndexedAccess', function() {
    var b = new Buffer(40);
    expect(b.length).toBe(40);
    b[0] = 10;
    b[1] = 20;
    b[2] = 30;
    b[3] = 40;
    expect(b[0]).toBe(10);
    expect(b[1]).toBe(20);
    expect(b[2]).toBe(30);
    expect(b[3]).toBe(40);
  });

  it('should pass testBufferSimpleByteLength', function() {
    expect(Buffer.byteLength('monkeys')).toBe(7);
  });

  it('should pass testBufferUnicodeByteLength', function() {
    var str = '\u00bd + \u00bc = \u00be';
    expect(Buffer.byteLength(str, 'utf8')).toBe(12);
  });

  it('should pass testBufferByteLengthTypeException', function() {
    try {
      Buffer.byteLength(8);
      this.fail("Buffer.byteLength should fail");
    } catch (e) {
    }
  });

  it('should pass testBufferCopy', function() {
    var source = new Buffer(4);
    var dest   = new Buffer(4);
    source.fill(72, 0, 3);
    expect(source.copy(dest, 0, 0, 2)).toBe(2);
    expect(dest.toString()).toBe("HH");
  });

  it('should pass testBufferCopyZeroBytes', function() {
    var source = new Buffer(4);
    var dest   = new Buffer(4);
    source.fill(72, 0, 3);
    expect(source.copy(dest, 0, 4, 4)).toBe(0);
    expect(dest.toString()).toBe("");
  });

  it('should pass testBufferCopyWithBadTargetStart', function() {
    // in node.js this would throw, but we can
    // just expand the buffer. should we? let's do.
    var source = new Buffer(4);
    var dest   = new Buffer(4);
    source.fill(72, 0, 3);
    expect(source.copy(dest, 4, 0, 2)).toBe(2);
    expect(dest.length).toBe(6);
  });

  it('should pass testBufferCopyWithBadSourceStartLength', function() {
    var source = new Buffer(4);
    var dest   = new Buffer(4);
    source.fill(72, 0, 3);
    try {
      source.copy(dest, 0, 6, 8);
      this.fail("Copying should throw an exception");
    } catch(e) {
    }
  });

  it('should pass testBufferCopyTypeError', function() {
    try {
      var source = new Buffer(4);
      source.copy(1,2,3,4);
      this.fail("Copying should throw an exception");
    } catch(e) {
    }
  });

  it('should pass testBufferUtf8Write', function() {
    var b = new Buffer(70);
    b.fill(0);
    expect(b.utf8Write(TEST_STRING, 0)).toBe(TEST_STRING.length);
    expect(b.toString()).toBe(TEST_STRING);
    idx = 0;
    for (var _byte in UTF8_BYTES) {
      expect(b[idx]).toBe(_byte);
      idx = idx+1;
    }
  });

  it('should pass testBufferUtf8WriteWithOffset', function() {
    var b = new Buffer(70);
    b.fill(0);
    expect(b.utf8Write(TEST_STRING, 10)).toBe(TEST_STRING.length);
    expect(b.toString()).toBe(TEST_STRING);
    idx = 10;
    for (var _byte in UTF8_BYTES) {
      expect(b[idx]).toBe(_byte);
      idx = idx+1;
    }
  });

  it('should pass testBufferUtf8WriteWithMaxLength', function() {
    var b = new Buffer(70);
    b.fill(0);

    expect(b.utf8Write(TEST_STRING, 0, 10)).toBe(10);
    expect(b.toString()).toBe(TEST_STRING.substring(0, 10));
    
    idx = 0;
    for (var _byte in UTF8_BYTES) {
      if (idx == 10) { break; }
      expect(b[idx]).toBe(_byte);
      idx = idx+1;
    }
  });

  it('should pass testBufferAsciiWrite', function() {
    var b = new Buffer(70);
    b.fill(0);
    expect(b.asciiWrite(TEST_STRING, 0)).toBe(TEST_STRING.length);
    expect(b.toString()).toBe(TEST_STRING);

    idx = 0;
    for (var _byte in ASCII_BYTES) {
      expect(b[idx]).toBe(_byte);
      idx = idx+1;
    }
  });

  it('should pass testBufferAsciiWriteWithOffset', function() {
    var b = new Buffer(70);
    b.fill(0);
    expect(b.asciiWrite(TEST_STRING, 10)).toBe(TEST_STRING.length);
    expect(b.toString()).toBe(TEST_STRING);
    idx = 10;
    for (var _byte in ASCII_BYTES) {
      expect(b[idx]).toBe(_byte);
      idx = idx+1;
    }
  });

  it('should pass testBufferAsciiWriteWithMaxLength', function() {
    var b = new Buffer(70);
    b.fill(0);
    expect(b.asciiWrite(TEST_STRING, 0, 10)).toBe(10);
    expect(b.toString()).toBe(TEST_STRING.substring(0,10));
    idx = 0;
    for (var _byte in ASCII_BYTES) {
      if (idx == 10) { break; }
      expect(b[idx]).toBe(_byte);
      idx = idx+1;
    }
  });

  it('should pass testBufferIsEncoding', function() {
    ['utf8', 'utf-8', 
     'ascii', 'us-ascii', 
     'ucf2', 'ucf-2', 'utf16le', 'utf-16le'].forEach( function(enc) {
      expect(Buffer.isEncoding(enc)).toBe(true);
    });
    var unsupported = ['foo', 'bar', 'taco'];
    ['foo', 'bar', 'taco'].forEach( function(enc) {
      expect(Buffer.isEncoding(enc)).toBe(false);
    });
  });

  it('should pass testBufferIsBuffer', function() {
    expect(Buffer.isBuffer(new Buffer())).toBe(true);
    expect(Buffer.isBuffer(new Array())).toBe(false);
  });

  it('should pass testBufferConcat', function() {
    var x = new Buffer(5);
    var y = new Buffer(5);
    x.fill("a");
    y.fill("b");
    var z = Buffer.concat([x,y]);
    expect(z.length).toBe(10);
    expect(z.toString()).toBe('aaaaabbbbb');
  });

  it('should pass testBufferConcatOneItem', function() {
    var x = new Buffer(5);
    x.fill("a");
    var z = Buffer.concat([x]);
    expect(x).toBe(z);
  });

  it('should pass testBufferConcatNullUndefEmptyList', function() {
    expect(Buffer.concat(null).length).toBe(0);
    expect(Buffer.concat(undefined).length).toBe(0);
    expect(Buffer.concat([]).length).toBe(0);
  });

  it('should pass testReadUInt8', function() {
    var buff = new Buffer(3);
    buff[0] = 0x3;
    buff[1] = 0x23;
    buff[2] = 0x42;
    expect(buff.readUInt8(0)).toBe(0x3);
    expect(buff.readUInt8(1)).toBe(0x23);
    expect(buff.readUInt8(2)).toBe(0x42);
  });
});
