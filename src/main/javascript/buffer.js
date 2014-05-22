"use strict";


function Buffer() {
  if (!(this instanceof Buffer)) return new Buffer(arguments);

  var self = new JSAdapter(
    Buffer.prototype,
    {
      delegate: {},
      _charsWritten: 0,
    },
    {
      __get__: function(name) {
        var index = Number(name);
        if ( ( typeof index ) == 'number' && ( index != NaN) ) {
          return this.delegate.getByte( index ) & 0xFF;
        }
      },
      __set__: function(name, value) {
        var index = Number(name);
        if ( ( typeof index) == 'number' && ( index != NaN )) {
          var byte = Number(value) & 0xFF;
          this.delegate.setByte( index, byte );
          return byte;
        }
      }
    } );

  if ( arguments.length == 1 ) {
    var first = arguments[0];
    // WARNING: Using a Vert.x buffer in the ctor function
    // for a Nodyn Buffer will work, but will not copy or
    // clone the Vert.x buffer, so changes made to it on
    // either side will be reflected in both.
    if ( first instanceof org.vertx.java.core.buffer.Buffer ) {
      self.delegate = first;
    } else if ( ( typeof first ) == 'number' ) {
      self.delegate = new org.vertx.java.core.buffer.Buffer( first );
    } else if ( ( typeof first ) == 'string' ) {
      self.delegate = new org.vertx.java.core.buffer.Buffer( first.toString() );
    } else if ( first.length ) {
      self.delegate = new org.vertx.java.core.buffer.Buffer( first.length );
      for ( var i = 0 ; i < first.length ; ++i ) {
        self[i] = first[i];
      }
    }
  } else if ( arguments.length == 2 ) {
    var str = arguments[0];
    var enc = encodingToJava( arguments[1] );
    self.delegate = new org.vertx.java.core.buffer.Buffer( str, enc );
  }

  self.toString = bufferToString;

  return self;
}

function encodingToJava(enc) {
  if ( ! Buffer.isEncoding(enc) ) {
    throw new TypeError( 'Unknown encoding: ' + enc );
  }
  enc = enc.toLowerCase();
  if ( enc == 'ascii' || enc == 'us-ascii') {
    return 'us-ascii';
  }

  if ( enc == 'utf8' || enc == 'utf-8') {
    return 'utf-8';
  }

  if ( enc == 'ucs2' || enc == 'utf16le' || enc == 'utf-16le' ) {
    return 'utf-16le';
  }

  return enc;
}

Buffer.encodingToJava = encodingToJava;

Object.defineProperty( Buffer.prototype, "length", {
  get: function() {
    return this.delegate.byteBuf.capacity();
  }
} );

var bufferToString = function(enc,start,end) {
  if (arguments.length == 0 ) {
    return this.delegate.toString('utf-8');
  }

  var codec = Codec.get( enc );

  if ( ! codec ) {
    throw new TypeError( "Unknown encoding: " + enc );
  }

  if ( arguments.length == 1 ) {
    return codec.encode( this );
  }

  if ( arguments.length == 2 ) {
    return codec.encode( this.slice(start) );
  }

  if ( arguments.length == 3 ) {
    return codec.encode( this.slice(start,end) );
  }
};

Buffer.prototype.write = function(/*str,offset,len,enc*/) {

  var str = arguments[0];
  var offset = 0;;
  var len = this.length - offset;
  var enc = 'utf8';

  if ( arguments.length == 1 ) {
    offset = 0;
  } else if ( arguments.length == 2 ) {
    if ( typeof arguments[1] == 'number' ) {
      offset = arguments[1];
    } else {
      enc = arguments[1];
    }
  } else if ( arguments.length == 3 ) {
    offset = arguments[1];
    if ( typeof arguments[2] == 'number' ) {
      len = arguments[2];
    } else {
      enc = arguments[2];
    }
  } else if ( arguments.length == 4 ) {
    offset = arguments[1];
    len = arguments[2];
    enc = arguments[3];
  }

  enc = encodingToJava(enc);

  var numChars = Math.min( str.length, this.length - offset, len );
  str = str.substring(0, numChars );

  var bytes = Helper.bytes( str, enc );

  this.delegate.setBytes( offset, bytes );
  this._charsWritten = numChars;
  return bytes.length;
};


Buffer.prototype.toJSON = function() {
};

Buffer.prototype.copy = function(targetBuf,targetStart,sourceStart,sourceEnd) {
  if ( ! targetStart ) {
    targetStart = 0;
  }
  if ( ! sourceStart ) {
    sourceStart = 0;
  }
  if ( ! sourceEnd ) {
    sourceEnd = this.length;
  }

  if ( targetStart > ( targetBuf.length - 1 ) ) {
    throw new RangeError( "targetStart out of bounds" );
  }

  var sourceLen = sourceEnd - sourceStart;
  var destLen = targetBuf.length - targetStart;

  if ( sourceLen > destLen ) {
    sourceLen = destLen;
  }

  var source = this.delegate.getBuffer( sourceStart, sourceStart + sourceLen );
  targetBuf.delegate.setBuffer( targetStart, source );
  return sourceLen;
};

Buffer.prototype.slice = function(start,end) {
  var b = new Buffer(0);
  if ( ! start ) {
    start = 0;
  }
  if ( ! end ) {
    end = this.length;
  }
  b.delegate = new org.vertx.java.core.buffer.Buffer( this.delegate.byteBuf.slice( start, (end - start ) ) );
  return b;
};

// 8-bit Unsigned

Buffer.prototype.readUInt8 = function(offset,noAssert) {
  return this.delegate.getByte( offset ) & 0xFF;
};

Buffer.prototype.writeUInt8 = function(value,offset,noAssert) {
  return this.delegate.getByte( offset ) & 0xFF;
};

// 8-bit Signed

Buffer.prototype.readInt8 = function(offset,noAssert) {
  return this.delegate.getByte( offset );
};

Buffer.prototype.writeInt8 = function(value,offset,noAssert) {
  this.delegate.setByte(offset, value);
};

// 16-bit Unsigned

Buffer.prototype.readUInt16LE = function(offset,noAssert) {
  return java.lang.Short.reverseBytes( this.delegate.getShort( offset ) ) & 0xFFFF;
};

Buffer.prototype.readUInt16BE = function(offset,noAssert) {
  return this.delegate.getShort( offset ) & 0xFFFF;
};

Buffer.prototype.writeUInt16LE = function(value,offset,noAssert) {
  this.delegate.setShort(offset, java.lang.Short.reverseBytes( value ) );
};

Buffer.prototype.writeUInt16BE = function(value,offset,noAssert) {
  this.delegate.setShort(offset, value);
};

// 16-bit Signed

Buffer.prototype.readInt16LE = function(offset,noAssert) {
  return java.lang.Short.reverseBytes( this.delegate.getShort( offset ) );
};

Buffer.prototype.readInt16BE = function(offset,noAssert) {
  return this.delegate.getShort( offset );
};

Buffer.prototype.writeInt16LE = function(value,offset,noAssert) {
  this.delegate.setShort(offset, java.lang.Short.reverseBytes( value) );
};

Buffer.prototype.writeInt16BE = function(value,offset,noAssert) {
  this.delegate.setShort(offset, value);
};

// 32-bit Unsigned

Buffer.prototype.readUInt32LE = function(offset,noAssert) {
  //return java.lang.Integer.toUnsignedLong( java.lang.Integer.reverseBytes( this.delegate.getInt( offset ) ) & 0xFFFFFFFF );
  var val = java.lang.Integer.reverseBytes( this.delegate.getInt( offset ) );
  val = val & 0xFFFFFFFF;
  if ( val < 0 ) {
    if ( val == -2147483648 ) {
      val = 0;
    }
    val = Number(-val);
    val = val + 2147483648;
  }
  return val;
};

Buffer.prototype.readUInt32BE = function(offset,noAssert) {
  var val = this.delegate.getInt( offset );
  val = val & 0xFFFFFFFF;
  if ( val < 0 ) {
    if ( val == -2147483648 ) {
      val = 0;
    }
    val = Number(-val);
    val = val + 2147483648;
  }
  return val;
};

Buffer.prototype.writeUInt32LE = function(value,offset,noAssert) {
  this.delegate.setInt(offset, java.lang.Integer.reverseBytes( value ) );
};

Buffer.prototype.writeUInt32BE = function(value,offset,noAssert) {
  this.delegate.setInt(offset, value);
};

// 32-bit Signed

Buffer.prototype.readInt32LE = function(offset,noAssert) {
  return java.lang.Integer.reverseBytes( this.delegate.getInt( offset ) );
};

Buffer.prototype.readInt32BE = function(offset,noAssert) {
  return this.delegate.getInt( offset ) & 0xFFFFFFFF;
};

Buffer.prototype.writeInt32LE = function(value,offset,noAssert) {
  this.delegate.setInt(offset, java.lang.Integer.reverseBytes( value) );
};

Buffer.prototype.writeInt32BE = function(value,offset,noAssert) {
  this.delegate.setInt(offset, value);
};

// Float

Buffer.prototype.readFloatLE = function(offset,noAssert) {
  var b = java.nio.ByteBuffer.allocate(4).order( java.nio.ByteOrder.LITTLE_ENDIAN );
  var bytes = this.delegate.getBytes(offset, offset+4);
  b.put( bytes );
  b.flip();
  return b.getFloat();
};

Buffer.prototype.readFloatBE = function(offset,noAssert) {
  return this.delegate.getFloat(offset);
};

Buffer.prototype.writeFloatLE = function(value,offset,noAssert) {
  var b = java.nio.ByteBuffer.allocate(4).order( java.nio.ByteOrder.LITTLE_ENDIAN );
  b.putFloat(value);
  this.delegate.setBytes(offset,b.array());
};

Buffer.prototype.writeFloatBE = function(value,offset,noAssert) {
  this.delegate.setFloat(offset, value);
};


// Double

Buffer.prototype.readDoubleLE = function(offset,noAssert) {
  var b = java.nio.ByteBuffer.allocate(8).order( java.nio.ByteOrder.LITTLE_ENDIAN );
  var bytes = this.delegate.getBytes(offset, offset+8);
  b.put( bytes );
  b.flip();
  return b.getDouble();
};

Buffer.prototype.readDoubleBE = function(offset,noAssert) {
  return this.delegate.getDouble(offset);
};

Buffer.prototype.writeDoubleLE = function(value,offset,noAssert) {
  var b = java.nio.ByteBuffer.allocate(8).order( java.nio.ByteOrder.LITTLE_ENDIAN );
  b.putDouble(value);
  this.delegate.setBytes(offset,b.array());
};

Buffer.prototype.writeDoubleBE = function(value,offset,noAssert) {
  this.delegate.setDouble(offset, value);
};

// Class functions

Buffer.prototype.fill = function(value,offset,end) {
  if ( ! offset ) {
    offset = 0;
  }

  if ( ! end ) {
    end = this.length;
  }

  if ( end > this.length ) {
    throw new RangeError( 'end out of bounds' );
  }

  var byte;

  if ( typeof value == 'string' ) {
    byte = value.charCodeAt(0);
  } else {
    byte = Number(value);
  }

  for ( var i = offset ; i < end ; ++i ) {
    this.delegate.setByte( i, byte );
  }
};

// Class methods

Buffer.byteLength = function(str,enc) {
  if ( ! enc ) {
    enc = 'utf8';
  }

  return Helper.bytes(str, encodingToJava(enc)).length;
}

Buffer.isEncoding = function(enc) {
  return [
    'ascii', 'us-ascii',
    'utf8', 'utf-8',
    'utf16le', 'utf-16le', 'ucs2',
    'base64',
    'binary',
    'hex' ].indexOf( enc ) >= 0;
}

Buffer.isBuffer = function(obj) {
  return Buffer.prototype.isPrototypeOf( obj );
}

Buffer.concat = function(list,len) {
  if ( ! list || list.length == 0 ) {
    return new Buffer(0);
  }

  if ( list.length == 1 ) {
    return list[0];
  }

  if ( ! len ) {
    len = 0;
    for ( var i = 0 ; i < list.length ; ++i ) {
      len += list[i].length;
    }
  }

  var b = new Buffer(len);
  var start = 0;

  for ( var i = 0 ; i < list.length ; ++i ) {
    start = list[i].copy( b, start );
  }

  return b;
}

Buffer.SlowBuffer = Buffer;
module.exports.Buffer = Buffer;
module.exports.buffer = {
  INSPECT_MAX_BYTES: 50
}

var Helper = org.projectodd.nodyn.buffer.Helper;
var Codec = require('nodyn/codec');
