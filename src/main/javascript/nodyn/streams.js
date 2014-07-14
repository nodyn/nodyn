"use strict";

var Stream = require('stream')
var util   = require('util');
var buffer = require('buffer').Buffer;

function InputStream(stream) {
  Stream.Readable.call( this );
  this._stream = new io.nodyn.stream.InputStreamWrap( process.EVENT_LOOP, stream );

  this._stream.on( 'data',  this._onData.bind(this ) );
  this._stream.on( 'end',   this._onEnd.bind(this) );
  this._stream.on( 'close', this._onClose.bind(this) );

  this.on('end', function() {
    this.emit('close');
  })
}
util.inherits(InputStream, Stream.Readable);

InputStream.prototype._onData = function(result) {
  var vbuf = new org.vertx.java.core.buffer.Buffer( result.result );
  var buf = new Buffer( vbuf );
  if ( ! this.push( buf ) ) {
    this._stream.readStop();
  }
}

InputStream.prototype._onEnd = function(result) {
  this.push( null );
}

InputStream.prototype._onClose = function() {
  if ( this.listeners('data').length == 0 ) {
    // end will never come, since no data consumers...
    this.emit('close');
  }
  // else, end will cause close to follow
}

InputStream.prototype._read = function() {
  this._stream.readStart();
}

InputStream.prototype._start = function() {
  this._stream.start();
}


module.exports.InputStream = InputStream;