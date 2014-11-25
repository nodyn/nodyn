
var Harness     = io.nodyn.buffer.BufferHarness;
var TEST_STRING = Harness.TEST_STRING;
var UTF8_BYTES  = Harness.UTF8_BYTE_STRING;
var ASCII_BYTES = Harness.ASCII_BYTE_STRING;
var UTF8_TEST_WRITE_BUFFER = Harness.UTF8_TEST_WRITE_BUFFER;

var helper = require('./specHelper');

describe("Buffer", function() {

  it('should be an instanceof Buffer', function() {
    var b = new Buffer('............');
    expect(b instanceof Buffer).toBeTruthy();
  });

  it('should pass testSafeConstructor', function() {
    var b = new Buffer(10);
    expect(b.length).toBe(10);
    b[0] = -1;
    // Node.js expects numbers to be between 0 and 255
    expect(b[0]).toBe(255);
  });

  it('should allow construction wtih an array of octets', function() {
    var b = new Buffer( [ 65, 66 ] );
    expect( b.length ).toBe( 2 );
    expect( b[0] ).toBe( 65 );
    expect( b[1] ).toBe( 66 );
  })

  it('should pass testDefaultConstructor', function() {
    var b = new Buffer('cheezy bits');
    expect(b.toString()).toBe('cheezy bits');
  });

  it('should pass testDefaultConstructorWithEncoding', function() {
    var b = new Buffer('cheez', 'utf16le');
    expect(b.toString('utf16le')).toBe('cheez');
    expect(b.toString()).toBe('c\u0000h\u0000e\u0000e\u0000z\u0000');
  });

  it('should pass testBufferWrite', function() {
    b = new Buffer(256);
    len = b.write('\u00bd + \u00bc = \u00be', 0);
    expect(len).toBe(12);
    expect(Buffer._charsWritten).toBe(9);
    expect(b.toString('utf8', 0, len)).toBe('½ + ¼ = ¾');
    utf8Bytes = Harness.toBytes(b.toString('utf8', 0, len));
    idx = 0;
    for (var _byte in utf8Bytes) {
      expect(_byte).toBe(UTF8_TEST_WRITE_BUFFER[idx]);
      idx = idx+1;
    }
  });

  it("should handle write() with just str and enc", function() {
    b = new Buffer(3);
    expect( b.write( 'foo', 'utf8' ) ).toBe(3);
    expect( b[0] ).toBe( 102 );
    expect( b[1] ).toBe( 111 );
    expect( b[2] ).toBe( 111 );
  });

  it("should handle write() with str, offset and enc", function() {
    b = new Buffer(3);
    expect( b.write( 'foo', 1, 'utf8' ) ).toBe(2);
    expect( b[0] ).toBe( 0 );
    expect( b[1] ).toBe( 102 );
    expect( b[2] ).toBe( 111 );
  });

  it('should pass testBufferFill', function() {
    var b = new Buffer(4);
    console.log("BUFFER " + b);
    console.log(b.fill);
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

  it('should pass testBufferOverfull', function() {
    var b = new Buffer(4);
    try {
      b.fill(1, 0, 5);
      this.fail("Buffer.fill should throw");
    } catch(e) {
    }
  });

  it('should pass testSlowBufferIndexedAccess', function() {
    var b = new (require('buffer').SlowBuffer)(1024);
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

  xit('should pass testBufferByteLengthTypeException', function() {
    try {
      Buffer.byteLength(8);
      this.fail("Buffer.byteLength should fail");
    } catch (e) {
    }
  });

  it('should pass testBufferCopy', function() {
    var source = new Buffer(4);
    var dest   = new Buffer(4);
    dest.fill(73, 0, 4);
    source.fill(72, 0, 4);
    expect(source.copy(dest, 0, 0, 2)).toBe(2);
    expect(dest.toString()).toBe("HHII");
  });


  it('should pass testBufferCopyZeroBytes', function() {
    var source = new Buffer(4);
    var dest   = new Buffer(4);
    dest.fill(73, 0, 4);
    source.fill(72, 0, 4);
    expect(source.copy(dest, 0, 4, 4)).toBe(0);
    expect(dest.toString()).toBe("IIII");
  });

  it('should pass testBufferCopyWithBadTargetStart', function() {
    var source = new Buffer(4);
    var dest   = new Buffer(4);
    source.fill(72, 0, 4);
    try {
      source.copy(dest, 4, 0, 2 );
      this.fail( "targetStart out of bounds should fail" );
    } catch (e) {
    }
  });

  it('should pass only copy into available room', function() {
    try {
    var source = new Buffer(4);
    var dest   = new Buffer(4);
    source.fill(72, 0, 4);
    dest.fill(65, 0, 4);
    var numCopied = source.copy(dest, 2, 0, 4 );
    expect( numCopied ).toBe(2);
    expect(dest.toString()).toBe( 'AAHH');
    } catch (err) {
      err.printStackTrace();
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
  try {
    var b = new Buffer(TEST_STRING.length);
    b.fill(0);
    expect(b.utf8Write(TEST_STRING, 0)).toBe(TEST_STRING.length);
    expect(b.toString()).toBe(TEST_STRING);
    idx = 0;
    for (var _byte in UTF8_BYTES) {
      expect(b[idx]).toBe(_byte);
      idx = idx+1;
    }
    } catch (err) {
      System.err.println( err );
      err.printStackTrace();
    }
  });

  xit('should pass testBufferUtf8WriteWithOffset', function() {
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

  xit('should pass testBufferUtf8WriteWithMaxLength', function() {
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

  xit('should pass testBufferAsciiWrite', function() {
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

  xit('should pass testBufferAsciiWriteWithOffset', function() {
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

  xit('should pass testBufferAsciiWriteWithMaxLength', function() {
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
    [ 'ascii',
      'utf8', 'utf-8',
      'utf16le', 'utf-16le', 'ucs2',
      'base64',
      'binary',
      'hex' ].forEach( function(enc) {
      expect(Buffer.isEncoding(enc)).toBe(true);
    });
    var unsupported = ['foo', 'bar', 'taco'];
    ['foo', 'bar', 'taco'].forEach( function(enc) {
      expect(Buffer.isEncoding(enc)).toBe(false);
    });
  });

  it('should pass testBufferIsBuffer', function() {
    expect(Buffer.isBuffer(new Buffer(0))).toBe(true);
    expect(Buffer.isBuffer([])).toBe(false);
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

  it('should pass concat empty list', function() {
    expect(Buffer.concat([]).length).toBe(0);
  });

  it( 'should provide for live/linked slices', function() {
    var buf = new Buffer( "original" );
    var slice = buf.slice();
    expect(slice.toString()).toBe("original");
    buf[1] = 66;
    expect(slice.toString()).toBe("oBiginal");
    slice[3] = 66;
    expect(buf.toString()).toBe("oBiBinal");
  });

  describe( "reading and writing", function() {

    it('should be able to read/write one byte as unsigned integers', function() {
      var buff = new Buffer(4);
      buff[0] = 0x3;
      buff[1] = 0x23;
      buff[2] = 0x42;
      buff[3] = 0xFF;
      expect(buff.readUInt8(0)).toBe(0x3);
      expect(buff.readUInt8(1)).toBe(0x23);
      expect(buff.readUInt8(2)).toBe(0x42);
      expect(buff.readUInt8(3)).toBe(0xFF);

      var buf = new Buffer(4);
      buf.writeUInt8(0x3,0);
      buf.writeUInt8(0x23,0);
      buf.writeUInt8(0x42,0);
      buf.writeUInt8(0xFF,0);

      expect(buff.readUInt8(0)).toBe(0x3);
      expect(buff.readUInt8(1)).toBe(0x23);
      expect(buff.readUInt8(2)).toBe(0x42);
      expect(buff.readUInt8(3)).toBe(0xFF);
    });

    it('should read/write signed 8-bit ints', function() {
     try {
      var buff = new Buffer(4);
      buff.writeInt8(-127,0);
      buff.writeInt8(127,1);
      buff.writeInt8(2,2);
      buff.writeInt8(-2,3);
      expect(buff.readInt8(0)).toBe(-127);
      expect(buff.readInt8(1)).toBe(127);
      expect(buff.readInt8(2)).toBe(2);
      expect(buff.readInt8(3)).toBe(-2);
      } catch ( err ) {
       err.printStackTrace();
      }
    });

    it( 'should read/write signed 16-bit ints', function() {
      var buff = new Buffer(4);
      buff.writeInt16BE( 2, 0 );
      buff.writeInt16BE( -420, 2 );
      expect(buff.readInt16BE(0)).toBe( 2 );
      expect(buff.readInt16BE(2)).toBe( -420 );
    });

    it ( "should be able to read two bytes as positive BE/LE unsigned ints", function() {
      var buf = new Buffer(2);

      buf.writeUInt16BE( 32768, 0 );
      expect(buf.readUInt16BE(0)).toBe( 32768 );
      expect(buf.readUInt16LE(0)).toBe( 128 );

      buf = new Buffer(2);

      buf.writeUInt16LE( 32768, 0 );
      expect(buf.readUInt16LE(0)).toBe( 32768 );
      expect(buf.readUInt16BE(0)).toBe( 128 );
    });

    it ( "should be able to read two bytes as positive BE/LE signed ints", function() {
      var buf = new Buffer(2);

      buf.writeInt16BE( 2142, 0 );
      expect(buf.readInt16BE(0)).toBe( 2142 );
      expect(buf.readInt16LE(0)).toBe( 24072 );

      buf = new Buffer(2);

      buf.writeInt16LE( 2142, 0 );
      expect(buf.readInt16LE(0)).toBe( 2142 );
      expect(buf.readInt16BE(0)).toBe( 24072 );
    });

    it ( "should be able to read two bytes as negative BE/LE signed ints", function() {
      var buf = new Buffer(2);
      buf.writeInt16BE( -2142, 0 );
      expect(buf.readInt16BE(0)).toBe( -2142 );
      expect(buf.readInt16LE(0)).toBe( -23817 );

      buf = new Buffer(2);
      buf.writeInt16LE( -2142, 0 );
      expect(buf.readInt16LE(0)).toBe( -2142 );
      expect(buf.readInt16BE(0)).toBe( -23817 );
    });

    it ( "should be able to read four bytes as positive BE/LE unsigned ints", function() {
      var buf = new Buffer(4);

      buf.writeUInt32BE( 3221225472, 0 );
      expect(buf.readUInt32BE(0)).toBe( 3221225472);
      expect(buf.readUInt32LE(0)).toBe( 192 );
      expect(buf.readInt32BE(0)).toBe(-1073741824);

      buf = new Buffer(4);

      buf.writeUInt32LE( 3221225472, 0 );
      expect(buf.readUInt32LE(0)).toBe( 3221225472);
      expect(buf.readUInt32BE(0)).toBe( 192 );
      expect(buf.readInt32LE(0)).toBe(-1073741824);

      // --

       buf = new Buffer(4);

       buf.writeUInt32BE( 2147483648, 0 );
       expect(buf.readUInt32BE(0)).toBe( 2147483648 );
       expect(buf.readUInt32LE(0)).toBe( 128 );
       expect(buf.readInt32BE(0)).toBe( -2147483648 );

       buf = new Buffer(4);

       buf.writeUInt32LE( 2147483648, 0 );
       expect(buf.readUInt32LE(0)).toBe( 2147483648 );
       expect(buf.readUInt32BE(0)).toBe( 128 );
       expect(buf.readInt32LE(0)).toBe( -2147483648 );

    });

    it ( "should be able to read four bytes as BE/LE signed ints", function() {
      var buf = new Buffer(4);
      buf.writeUInt32BE( 3221225472, 0 );

      expect(buf.readInt32BE(0)).toBe( -1073741824);
      expect(buf.readInt32LE(0)).toBe( 192 );

      buf = new Buffer(4);
      buf.writeInt32BE( -1073741824, 0 );
      expect(buf.readInt32BE(0)).toBe( -1073741824);
      expect(buf.readInt32LE(0)).toBe( 192 );
      expect(buf.readUInt32BE(0)).toBe( 3221225472 );

      buf = new Buffer(4);
      buf.writeInt32LE( -1073741824, 0 );
      expect(buf.readInt32LE(0)).toBe( -1073741824);
      expect(buf.readInt32BE(0)).toBe( 192 );
      expect(buf.readUInt32LE(0)).toBe( 3221225472 );
    });

    it( "should be able to read four bytes as BE/LE floats", function() {
      var buf = new Buffer(4);

      buf.writeFloatBE(0xCAFEBABE, 0);
      // <Buffer 4f 4a fe bb>
      expect( buf[0] ).toBe( 0x4f );
      expect( buf[1] ).toBe( 0x4a );
      expect( buf[2] ).toBe( 0xfe );
      expect( buf[3] ).toBe( 0xbb );

      buf = new Buffer(4);
      buf.writeFloatLE(0xcafebabe, 0);
      // <Buffer bb fe 4a 4f>
      expect( buf[0] ).toBe( 0xbb );
      expect( buf[1] ).toBe( 0xfe );
      expect( buf[2] ).toBe( 0x4a );
      expect( buf[3] ).toBe( 0x4f );

      buf.writeFloatBE( 39.99, 0 );
      var val = buf.readFloatBE(0);
      var delta = val - 39.99;
      expect( delta ).toBeLessThan( 1 );

      buf.writeFloatLE( 39.99, 0 );
      val = buf.readFloatLE(0);
      delta = val - 39.99;
      expect( delta ).toBeLessThan( 1 );
    });

    it( "should be able to read eight bytes as BE/LE doubles", function() {
      var buf = new Buffer(8);
      buf.writeDoubleBE( 39.99, 0 );
      var val = buf.readDoubleBE(0);
      var delta = val - 39.99;
      expect( delta ).toBeLessThan( 1 );

      buf = new Buffer(8);
      buf.writeDoubleLE( 39.99, 0 );
      val = buf.readDoubleLE(0);
      delta = val - 39.99;
      expect( delta ).toBeLessThan( 1 );
    });

  });

  it( "should support base64 on toString", function(){
    try {
    var b = new Buffer( "tacos" );
    expect( b.toString('base64') ).toBe( 'dGFjb3M=' );
    } catch (err) {
      print(err);
      err.printStackTrace();
    }

  });

  it( "should support hex on toString", function() {
    var b = new Buffer( "tacos" );
    expect( b.toString('hex') ).toBe( '7461636f73' );
  });

  xit( "should accept a vertx Buffer instance in the ctor function", function() {
    var b1 = new Buffer('Now is the winter of our discontent');
    var b2 = new Buffer( b1._buffer );
    expect( b1.toString() ).toBe( b2.toString() );
  });

});
