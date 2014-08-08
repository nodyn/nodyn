/*
 * Copyright 2014 Red Hat, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

module.exports.setupBufferJS = function(target, internal) {
  module.exports.createBuffer = function(nettyBuffer) {
    var b = new target(nettyBuffer.readableBytes());
    io.nodyn.buffer.Buffer.inject( b, nettyBuffer );
    return b;
  }

  module.exports.extractBuffer = function(obj) {
    return io.nodyn.buffer.Buffer.extract(obj);
  }

  module.exports.extractByteArray = function(obj) {
    return io.nodyn.buffer.Buffer.extractByteArray(obj);
  }

  // ----------------------------------------
  // Prototype
  // ----------------------------------------

  // Slice

  target.prototype.asciiSlice = function(start, end) {
    return io.nodyn.buffer.Buffer.asciiSlice( this, start, end );
  };

  target.prototype.base64Slice = function(start, end) {
    return io.nodyn.buffer.Buffer.base64Slice( this, start, end);
  };

  target.prototype.binarySlice = function(start, end) {
    return io.nodyn.buffer.Buffer.binarySlice( this, start, end);
  };

  target.prototype.hexSlice = function(start, end) {
    return io.nodyn.buffer.Buffer.hexSlice( this, start, end );
  };

  target.prototype.ucs2Slice = function(start, end) {
    return io.nodyn.buffer.Buffer.ucs2Slice( this, start, end );
  };

  target.prototype.utf8Slice = function(start, end) {
    return io.nodyn.buffer.Buffer.utf8Slice( this, start, end )
  };

  // Write

  target.prototype.asciiWrite = function(str, offset, len) {
    offset = offset || 0;
    len    = len    || this.length;
    var l = io.nodyn.buffer.Buffer.asciiWrite( this, start, end );
    Buffer._charsWritten = l;
    return l;
  };

  target.prototype.base64Write = function(str, offset, len) {
    offset = offset || 0;
    len    = len    || this.length;
    var l = io.nodyn.buffer.Buffer.base64Write( this, str, offset, len );
    Buffer._charsWritten = len;
    return l;
  };

  target.prototype.binaryWrite = function(str, offset, len) {
    offset = offset || 0;
    len    = len    || this.length;
    var l = io.nodyn.buffer.Buffer.binaryWrite( this, str, offset, len );
    Buffer._charsWritten = l;
    return l;
  };

  target.prototype.hexWrite = function(str, offset, len) {
    offset = offset || 0;
    len    = len    || this.length;
    var l = io.nodyn.buffer.Buffer.hexWrite( this, str, offset, len );
    Buffer._charsWritten = l * 2;
    return;
  };

  target.prototype.ucs2Write = function(str, offset, len) {
    offset = offset || 0;
    len    = len    || this.length;
    var l = io.nodyn.buffer.Buffer.ucs2Write( this, str, offset, len );
    Buffer._charsWritten = l / 2;
    return l;
  };

  target.prototype.utf8Write = function(str, offset, len) {
    offset = offset || 0;
    len    = len    || this.length;
    var l = io.nodyn.buffer.Buffer.utf8Write(this, str, offset, len);
    Buffer._charsWritten = l[0];
    return l[1];
  };

  target.prototype.readDoubleBE = function(offset, noAssert) {
    return io.nodyn.buffer.Buffer.readDoubleBE( this, offset );
  };

  target.prototype.readDoubleLE = function(offset, noAssert) {
    return io.nodyn.buffer.Buffer.readDoubleLE( this, offset );
  };

  target.prototype.readFloatBE = function(offset, noAssert) {
    return io.nodyn.buffer.Buffer.readFloatBE( this, offset );
  };

  target.prototype.readFloatLE = function(offset, noAssert) {
    return io.nodyn.buffer.Buffer.readFloatLE( this, offset );
  };

  target.prototype.writeDoubleBE = function(value, offset, noAssert) {
    return io.nodyn.buffer.Buffer.writeDoubleBE( this, value, offset );
  };

  target.prototype.writeDoubleLE = function(value, offset, noAssert) {
    return io.nodyn.buffer.Buffer.writeDoubleLE( this, value, offset );
  };

  target.prototype.writeFloatBE = function(value, offset, noAssert) {
    return io.nodyn.buffer.Buffer.writeFloatBE( this, value, offset );
  };

  target.prototype.writeFloatLE = function(value, offset, noAssert) {
    return io.nodyn.buffer.Buffer.writeFloatLE( this, value, offset );
  };

  // ----------------------------------------

  target.prototype._nettyBuffer = function() {
    return module.exports.extractBuffer(this);
  }

  target.prototype._byteArray = function() {
    return module.exports.extractByteArray(this);
  }

  // TODO: remove this
  target.prototype._vertxBuffer = function() {
    return new org.vertx.java.core.buffer.Buffer( this._nettyBuffer() );
  }


  // ----------------------------------------

  target.prototype.copy = function(target, targetStart, sourceStart, sourceEnd) {
    targetStart = targetStart || 0;
    sourceStart = sourceStart || 0;
    sourceEnd   = sourceEnd   || this.length;

    if ( targetStart >= target.length ) {
      throw new RangeError( "targetStart out of bounds" );
    }

    return io.nodyn.buffer.Buffer.copy( this, target, targetStart, sourceStart, sourceEnd );
  };

  target.prototype.fill = function(value, offset, end) {
    offset = offset || 0;
    end    = end || this.length;

    if ( end > this.length ) {
      throw new RangeError( "end out of bounds" );
    }
    return io.nodyn.buffer.Buffer.fill( this, value, offset, end );
  };

  // ----------------------------------------
  // Internal
  // ----------------------------------------

  internal.compare = function(a,b) {

  };

  internal.byteLength = io.nodyn.buffer.Internal.byteLength;
}