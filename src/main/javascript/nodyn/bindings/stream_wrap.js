
"use strict";

var util = require('util');
var Handle = require('nodyn/bindings/handle_wrap').Handle;

function Stream(stream) {
  this._stream = stream;
  this._stream.on( 'data', Stream.prototype._onData.bind(this) );
  this._stream.on( 'eof', Stream.prototype._onEof.bind(this) );
  Handle.call( this, this._stream );
}

util.inherits(Stream, Handle);

// ----------------------------------------

Stream.prototype._onData = function(result) {
  var nread = result.result.readableBytes();
  this.onread( nread, new Buffer( result.result ) );
}

Stream.prototype._onEof = function(result) {
  if ( this.onread ) {
    this.onread( -1 );
  }
}

// ----------------------------------------

Stream.prototype.readStart = function() {
  this._stream.readStart();
}

Stream.prototype.readStop = function() {
  this._stream.readStop();
}

Stream.prototype.writeUtf8String = function(req,data) {
  this._stream.writeUtf8String(data);
}

Stream.prototype.writeAsciiString = function(req,data) {
  this._stream.writeAsciiString(data);
}

Stream.prototype.writeBuffer = function(req,data) {
  this._stream.write( data._nettyBuffer() );
  req.oncomplete(0, this, req );
}

Stream.prototype.shutdown = function(req) {
  this._stream.shutdown();
  req.oncomplete( 0, this, req );
}

module.exports.Stream = Stream;