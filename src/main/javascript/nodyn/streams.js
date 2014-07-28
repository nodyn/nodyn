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

    this.isTTY = false;
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

  function OutputStream(stream, options) {
    Stream.Writable.call( this, options );
    this._stream = new io.nodyn.stream.OutputStreamWrap( process.EVENT_LOOP, stream );

    this.on('end', function() {
      this.emit('close');
    });
    this.on('drain', OutputStream.prototype._onDrain.bind(this));
    this.on('finish', OutputStream.prototype._onFinish.bind(this));
    this.on('pipe', OutputStream.prototype._onPipe.bind(this));
    this.on('unpipe', OutputStream.prototype._onUnpipe.bind(this));
    this.on('error', OutputStream.prototype._onError.bind(this));

    this.isTTY = false;
  }
  util.inherits(OutputStream, Stream.Writable);

  OutputStream.prototype._start = function() {
    this._stream.start();
  }

  OutputStream.prototype._write = function(chunk, encoding, callback) {
    if (chunk instanceof Buffer) {
      this._stream.write(chunk.delegate.byteBuf )
    } else if (typeof chunk === 'string') {
      this._stream.write( chunk, encoding );
      //encoding = encoding || 'utf8';
      //this._stream.write( new Buffer( chunk, encoding ).delegate.byteBuf )
    } else {
      this._stream.write( chunk, encoding );
      //this._stream.write( new Buffer( chunk ).delegate.byteBuf )
    }
    callback();
  };

/*
  OutputStream.prototype._writev = function(chunks, vcallback) {
    for ( i = 0 ; i < chunks.length ; ++i ) {
      var chunk = chunks[i].chunk;
      var encoding = chunks[i].encoding;
      var callback = chunks[i].callback;

      if (chunk instanceof Buffer) {
        this._stream.writeNoFlush(chunk.delegate.byteBuf )
      } else if (typeof chunk === 'string') {
        encoding = encoding || 'utf8';
        this._stream.writeNoFlush( new Buffer( chunk, encoding ).delegate.byteBuf )
      } else {
        this._stream.writeNoFlush( new Buffer( chunk ).delegate.byteBuf )
      }

      callback();
    }
    this._stream.flush();
    vcallback();
  };
  */

  OutputStream.prototype._onDrain = function() {
    print("DRAINING")
  };

  OutputStream.prototype._onFinish = function() {
    print("FINISHING")
  };

  OutputStream.prototype._onPipe = function() {
    print("PIPING")
  };

  OutputStream.prototype._onUnpipe = function() {
    print("UNPIPING")
  };

  OutputStream.prototype._onError = function() {
    print("ERRORING")
  };

  OutputStream.prototype.ref = function() {
    this._stream.ref();
  };

  OutputStream.prototype.unref = function() {
    this._stream.unref();
  };

  module.exports.OutputStream = OutputStream;
})();
