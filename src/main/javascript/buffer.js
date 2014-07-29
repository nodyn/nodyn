"use strict";


var VertxBuffer = org.vertx.java.core.buffer.Buffer;
var NettyBuffer = io.netty.buffer.ByteBuf;
var Unpooled    = io.netty.buffer.Unpooled;
var Charset     = java.nio.charset.Charset

var BufferWrap = io.nodyn.buffer.BufferWrap;

function Buffer() {
  if (!(this instanceof Buffer)) return new Buffer(arguments);

  var self = new JSAdapter(
    Buffer.prototype,
    {
      _buffer: {},
      _charsWritten: 0,
    },
    {
      __get__: function(name) {
        var index = Number(name);
        if ( ( typeof index ) == 'number' && ( ! isNaN(index) ) ) {
          if ( index >= this.length ) {
            return;
          }
          return this._buffer.getByte( index );
        }
      },
      __set__: function(name, value) {
        var index = Number(name);
        if ( ( typeof index) == 'number' && ( ! isNaN(index) ) ) {
          if ( index >= this.length ) {
            return;
          }
          var byte = Number(value) & 0xFF;
          this._buffer.putByte( index, byte );
          return byte;
        }
      }
    } );

  if ( arguments.length == 1 ) {
    var first = arguments[0];
    if ( first instanceof BufferWrap ) {
      self._buffer = first;
    }  else if ( first instanceof VertxBuffer ) {
      self._buffer = new BufferWrap( Unpooled.copiedBuffer( first.byteBuf ) );
    } else if ( first instanceof NettyBuffer ) {
      self._buffer = new BufferWrap( first );
    } else if ( ( typeof first ) == 'number' ) {
      self._buffer = new BufferWrap( first );
    } else if ( ( typeof first ) == 'string' ) {
      self._buffer = new BufferWrap( first.toString(), 'utf8' );
    } else if ( first.length ) {
      self._buffer = new BufferWrap( first.length );
      for ( var i = 0 ; i < first.length ; ++i ) {
        self[i] = first[i];
      }
    }
  } else if ( arguments.length == 2 ) {
    var str = arguments[0];
    var enc = encodingToJava( arguments[1] );
    self._buffer = new BufferWrap( str, enc );
  }

  self.toString = bufferToString;

  return self;
}

Object.defineProperty( Buffer, "_charsWritten", {
  get: function() {
    return BufferWrap._charsWritten;
  }
});

function encodingToJava(enc) {
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

  if ( ! Buffer.isEncoding(enc) ) {
    throw new TypeError( 'Unknown encoding: ' + enc );
  }

  return enc;
}

Buffer.encodingToJava = encodingToJava;

Object.defineProperty( Buffer.prototype, "length", {
  get: function() {
    return this._buffer.length;
  }
} );

var bufferToString = function(enc,start,end) {
  if (arguments.length <= 1 && enc == null) {
    return this._buffer.toString( "utf8" );
  }

  if ( end > this._buffer.length ) {
    end = this._buffer.length;
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

Buffer.prototype._byteArray = function() {
  return this._buffer.byteArray();
}

Buffer.prototype._vertxBuffer = function() {
  return new VertxBuffer( this._buffer.byteBuf );
}

Buffer.prototype._nettyBuffer = function() {
  return this._buffer.byteBuf;
}

Buffer.prototype.write = function(/*str,offset,len,enc*/) {

  var str = arguments[0];
  var offset = 0;
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

  return this._buffer.write( str, offset, len, enc );
};


Buffer.prototype.utf8Write = function(str, offset) {
  return this.write( str, offset, this.length, 'utf8' );
}


Buffer.prototype.copy = function(targetBuf,targetStart,sourceStart,sourceEnd) {
  if ( ! targetStart ) {
    targetStart = 0;
  }
  if ( ! sourceStart ) {
    sourceStart = 0;
  }
  if ( ! sourceEnd ) {
    sourceEnd = -1;
  }

  if ( targetStart > ( targetBuf.length - 1 ) ) {
    throw new RangeError( "targetStart out of bounds" );
  }

  return this._buffer.copy( targetBuf._buffer, targetStart, sourceStart, sourceEnd );
};

Buffer.prototype.slice = function(start,end) {
  if ( ! start ) {
    start = 0;
  }
  if ( ! end ) {
    end = -1;
  }
  return new Buffer( this._buffer.slice( start, end ) );
};

// 8-bit Unsigned

Buffer.prototype.readUInt8 = function(offset,noAssert) {
  return this._buffer.readUInt8( offset );
};

Buffer.prototype.writeUInt8 = function(value,offset,noAssert) {
  return this._buffer.writeUInt8( value, offset );
};

// 8-bit Signed

Buffer.prototype.readInt8 = function(offset,noAssert) {
  return this._buffer.readInt8(offset);
};

Buffer.prototype.writeInt8 = function(value,offset,noAssert) {
  return this._buffer.writeInt8( value, offset );
};

// 16-bit Unsigned

Buffer.prototype.readUInt16LE = function(offset,noAssert) {
  return this._buffer.readUInt16LE( offset );
};

Buffer.prototype.readUInt16BE = function(offset,noAssert) {
  return this._buffer.readUInt16BE( offset );
};

Buffer.prototype.writeUInt16LE = function(value,offset,noAssert) {
  return this._buffer.writeUInt16LE(value, offset);
};

Buffer.prototype.writeUInt16BE = function(value,offset,noAssert) {
  return this._buffer.writeUInt16BE(value, offset);
};

// 16-bit Signed

Buffer.prototype.readInt16LE = function(offset,noAssert) {
  return this._buffer.readInt16LE( offset );
};

Buffer.prototype.readInt16BE = function(offset,noAssert) {
  return this._buffer.readInt16BE( offset );
};

Buffer.prototype.writeInt16LE = function(value,offset,noAssert) {
  return this._buffer.writeInt16LE(value,offset);
};

Buffer.prototype.writeInt16BE = function(value,offset,noAssert) {
  return this._buffer.writeInt16BE(value,offset);
};

// 32-bit Unsigned

Buffer.prototype.readUInt32LE = function(offset,noAssert) {
  return this._buffer.readUInt32LE( offset );
};

Buffer.prototype.readUInt32BE = function(offset,noAssert) {
  return this._buffer.readUInt32BE( offset );
};

Buffer.prototype.writeUInt32LE = function(value,offset,noAssert) {
  return this._buffer.writeUInt32LE(value,offset);
};

Buffer.prototype.writeUInt32BE = function(value,offset,noAssert) {
  return this._buffer.writeUInt32BE(value,offset);
};

// 32-bit Signed

Buffer.prototype.readInt32LE = function(offset,noAssert) {
  return this._buffer.readInt32LE(offset);
};

Buffer.prototype.readInt32BE = function(offset,noAssert) {
  return this._buffer.readInt32BE(offset);
};

Buffer.prototype.writeInt32LE = function(value,offset,noAssert) {
  return this._buffer.writeInt32LE(value,offset);
};

Buffer.prototype.writeInt32BE = function(value,offset,noAssert) {
  return this._buffer.writeInt32BE(value, offset);
};

// Float

Buffer.prototype.readFloatLE = function(offset,noAssert) {
  return this._buffer.readFloatLE(offset);
};

Buffer.prototype.readFloatBE = function(offset,noAssert) {
  return this._buffer.readFloatBE(offset);
};

Buffer.prototype.writeFloatLE = function(value,offset,noAssert) {
  return this._buffer.writeFloatLE(value,offset);
};

Buffer.prototype.writeFloatBE = function(value,offset,noAssert) {
  return this._buffer.writeFloatBE(value,offset);
};


// Double

Buffer.prototype.readDoubleLE = function(offset,noAssert) {
  return this._buffer.readDoubleLE(offset);
};

Buffer.prototype.readDoubleBE = function(offset,noAssert) {
  return this._buffer.readDoubleBE(offset);
};

Buffer.prototype.writeDoubleLE = function(value,offset,noAssert) {
  return this._buffer.writeDoubleLE(value, offset);
};

Buffer.prototype.writeDoubleBE = function(value,offset,noAssert) {
  return this._buffer.writeDoubleBE(value,offset);
};

// Class functions

Buffer.prototype.fill = function(value,offset,end) {
  if ( ! offset ) {
    offset = 0;
  }

  if ( ! end ) {
    end = -1;
  }

  if ( end > this.length ) {
    throw new RangeError( 'end out of bounds' );
  }

  this._buffer.fill(value, offset, end);
};

// Class methods

Buffer.byteLength = function(str,enc) {
  if ( ! enc ) {
    enc = 'utf8';
  }

  return BufferWrap.byteLength(str, encodingToJava(enc));
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

var Codec = require('nodyn/codec');
