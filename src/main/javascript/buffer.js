
var vertx = org.vertx.java.core.VertxFactory.newVertx();

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
        if ( ( typeof index ) == 'number' ) {
          value = this.delegate.getByte( index );
          value = value & 0xFF;
          return value;
        }
      },
      __set__: function(name, value) {
        var index = Number(name);
        if ( ( typeof index) == 'number' ) {
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
  enc = enc.toLowerCase();
  if ( enc == 'utf8') {
    return 'utf-8';
  }
  if ( enc == 'ascii' ) {
    return 'us-ascii';
  }
  if ( enc == 'ucs2' ) {
    return 'ucs-2';
  }
  if ( enc == 'utf16le' ) {
    return 'utf-16le';
  }

  return 'utf-8';
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

Buffer.prototype.write = function(str,offset,len,enc) {

  if ( arguments.length < 2 ) {
    offset = 0;
  }

  if ( arguments.length < 3 ) {
    enc = 'utf-8';
  }

  if ( arguments.length == 4 ) {
    enc = encodingToJava(enc);
  }

  var numChars = Math.min( str.length, this.length - offset );
  str = str.substring(0, numChars );

  var bytes = Helper.bytes( str, enc );

  this.delegate.setBytes( offset, bytes );
  this._charsWritten = numChars;
  return bytes.length;
};


Buffer.prototype.toJSON = function() {
};

Buffer.prototype.copy = function(targetBuf,targetStart,sourceStart,sourceEnd) {
};

Buffer.prototype.slice = function(start,end) {
};

Buffer.prototype.slice = function(start,end) {
};

Buffer.prototype.readUInt8 = function(offset,noAssert) {
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
};

Buffer.prototype.readInt16LE = function(offset,noAssert) {
};

Buffer.prototype.readInt16BE = function(offset,noAssert) {
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
};

Buffer.prototype.writeInt16LE = function(value,offset,noAssert) {
};

Buffer.prototype.writeInt16BE = function(value,offset,noAssert) {
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
};

Buffer.prototype.SlowBuffer = Buffer;

module.exports = Buffer;
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

