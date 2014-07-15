(function() {
  "use strict";
  var Stream = require('stream');
  var util   = require('util');
  var Buffer = require('buffer').Buffer;

  function InputStream(stream) {
    Stream.Readable.call( this );
    this._stream = new io.nodyn.stream.InputStreamWrap( process.EVENT_LOOP, stream );

    this._stream.on( 'data',  this._onData.bind(this) );
    this._stream.on( 'end',   this._onEnd.bind(this) );
    this._stream.on( 'close', this._onClose.bind(this) );

    this.on('end', function() {
      this.emit('close');
    });

    this.isTTY = this._stream.isTTY();
  }
  util.inherits(InputStream, Stream.Readable);

  InputStream.prototype._onData = function(result) {
    var vbuf = new org.vertx.java.core.buffer.Buffer( result.result );
    var buf = new Buffer( vbuf );
    if ( ! this.push( buf ) ) {
      this._stream.readStop();
    }
  };

  InputStream.prototype._onEnd = function(result) {
    this.push( null );
  };

  InputStream.prototype._onClose = function() {
    if ( this.listeners('data').length === 0 ) {
      // end will never come, since no data consumers...
      this.emit('close');
    }
    // else, end will cause close to follow
  };

  InputStream.prototype._read = function() {
    this._stream.readStart();
  };

  InputStream.prototype._start = function() {
    this._stream.start();
  };

  InputStream.prototype.ref = function() {
    this._stream.ref();
  };

  InputStream.prototype.unref = function() {
    this._stream.unref();
  };

  module.exports.InputStream = InputStream;

  function OutputStream(stream) {
    Stream.Writable.call( this );
    this._stream = new io.nodyn.stream.OutputStreamWrap( process.EVENT_LOOP, stream );

    this._stream.on( 'drain',  this._onDrain.bind(this) );
    this._stream.on( 'finish', this._onFinish.bind(this) );
    this._stream.on( 'pipe',   this._onPipe.bind(this) );
    this._stream.on( 'unpipe', this._onUnpipe.bind(this) );
    this._stream.on( 'error',  this._onError.bind(this) );

    this.on('end', function() {
      this.emit('close');
    });

    this.isTTY = this._stream.isTTY();
  }
  util.inherits(OutputStream, Stream.Writable);

  OutputStream.prototype._write = function(chunk, encoding, callback) {
    // todo - figure out why encoding ends up as 'buffer'
    // var args = Array.prototype.slice.call(arguments);
    // for (var a in args) {
    //   print("ARG: " + args[a]);
    // }
    encoding = encoding || 'utf8';
    this._stream.write(chunk.toString());
  };

  OutputStream.prototype._onDrain = function() {
  };

  OutputStream.prototype._onFinish = function() {
  };

  OutputStream.prototype._onPipe = function() {
  };

  OutputStream.prototype._onUnpipe = function() {
  };

  OutputStream.prototype._onError = function() {
  };

  module.exports.OutputStream = OutputStream;
})();
