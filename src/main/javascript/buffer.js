"use strict";

var Helper = org.projectodd.nodyn.buffer.Helper;

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
    if ( ( typeof first ) == 'number' ) {
      self.delegate = new org.vertx.java.core.buffer.Buffer( first );
    } else if ( ( typeof first ) == 'string' ) {
      self.delegate = new org.vertx.java.core.buffer.Buffer( first.toString() );
    } else if ( ( typeof first ) == 'object' && first.length ) {
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

Object.defineProperty( Buffer.prototype, "length", {
  get: function() {
    return this.delegate.byteBuf.capacity();
  }
} );

var bufferToString = function(enc,start,end) {
  if (arguments.length == 0 ) {
    return this.delegate.toString('utf-8');
  }
  if ( arguments.length == 1 ) {
    return this.delegate.toString(encodingToJava(enc));
  }
  if ( arguments.length == 2 ) {
    return this.delegate.toString(encodingToJava(enc)).substring(start);
  }
  if ( arguments.length == 3 ) {
    return this.delegate.toString(encodingToJava(enc)).substring(start,end);
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
      enc = argumnets[1];
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
};

Buffer.prototype.readUInt8 = function(offset,noAssert) {
  return this.delegate.getByte( offset ) & 0xFF;
};

Buffer.prototype.readUInt16LE = function(offset,noAssert) {
};

Buffer.prototype.readUInt16BE = function(offset,noAssert) {
};

Buffer.prototype.readUInt32LE = function(offset,noAssert) {
};

Buffer.prototype.readUInt32BE = function(offset,noAssert) {
};

Buffer.prototype.readInt8 = function(offset,noAssert) {
  return this.delegate.getByte( offset );
};

Buffer.prototype.readInt16LE = function(offset,noAssert) {
};

Buffer.prototype.readInt16BE = function(offset,noAssert) {
  return this.delegate.getShort( offset );
};

Buffer.prototype.readInt32LE = function(offset,noAssert) {
};

Buffer.prototype.readInt32BE = function(offset,noAssert) {
};

Buffer.prototype.readFloatLE = function(offset,noAssert) {
};

Buffer.prototype.readFloatBE = function(offset,noAssert) {
};

Buffer.prototype.readDoubleLE = function(offset,noAssert) {
};

Buffer.prototype.readDoubleBE = function(offset,noAssert) {
};

Buffer.prototype.writeUInt8 = function(value,offset,noAssert) {
};

Buffer.prototype.writeUInt16LE = function(value,offset,noAssert) {
};

Buffer.prototype.writeUInt16BE = function(value,offset,noAssert) {
};

Buffer.prototype.writeUInt32LE = function(value,offset,noAssert) {
};

Buffer.prototype.writeUInt32BE = function(value,offset,noAssert) {
};

Buffer.prototype.writeInt8 = function(value,offset,noAssert) {
  this.delegate.setByte(offset, value);
};

Buffer.prototype.writeInt16LE = function(value,offset,noAssert) {
};

Buffer.prototype.writeInt16BE = function(value,offset,noAssert) {
  this.delegate.setShort(offset, value);
};

Buffer.prototype.writeInt32LE = function(value,offset,noAssert) {
};

Buffer.prototype.writeInt32BE = function(value,offset,noAssert) {
};

Buffer.prototype.writeFloatLE = function(value,offset,noAssert) {
};

Buffer.prototype.writeFloatBE = function(value,offset,noAssert) {
};

Buffer.prototype.writeDoubleLE = function(value,offset,noAssert) {
};

Buffer.prototype.writeDoubleBE = function(value,offset,noAssert) {
};

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
/*
var Buffer = module.exports.Buffer = nodyn.buffer;

// For now, let's not distinguish between SlowBuffer and
// Buffer. We'll see if we need to do otherwise later.
Buffer.prototype.SlowBuffer = Buffer;

Buffer.prototype.concat = function() {
  var args   = Array.prototype.slice.call(arguments, 0);
  var list   = args[0];
  var start  = 0;
  var buffer = new Buffer();

  if (list == undefined || list == null || list.length == 0) {
    return new Buffer();
  } else if (list.length == 1) {
    return list[0];
  }
  list.forEach( function(buff) {
    start = start + buff.copy(buffer, start);
  });
  return buffer;
}

*/

