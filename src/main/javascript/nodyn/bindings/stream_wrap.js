
"use strict";

function Stream(fd) {
  this._stream.on( "data", Stream.prototype._onData.bind(this) );
}

// ----------------------------------------
Stream.prototype._onData = function(result) {
  var nread = result.result.readableBytes();
  this.onread( nread, new Buffer( result.result ) );
}

// ----------------------------------------

Stream.prototype.readStart = function() {
  this._stream.readStart();
}

Stream.prototype.readStop = function() {
  this._stream.readStop();
}

Stream.prototype.writeUtf8String = function(req,data) {
  this._stream.writeUtf8String( data );
}

module.exports.Stream = Stream;