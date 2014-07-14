"use strict";

var net   = NativeRequire.require('net');
var util  = NativeRequire.require('util');

var EventEmitter = require('events').EventEmitter;

var Stream = NativeRequire.require('stream');
var MultiMap = NativeRequire.require('nodyn/multiMap');

function IncomingMessage(incoming) {
  if (!(this instanceof IncomingMessage)) {
    return new IncomingMessage(incoming);
  }

  Stream.Readable.call(this);
  this._incoming = incoming;

  this.statusCode  = this._incoming.statusCode;
  this.headers     = this._incoming.headers;
  this.url         = this._incoming.url;
  this.method      = this._incoming.method;

  this.httpVersion      = this._incoming.httpVersion;
  this.httpVersionMajor = this._incoming.httpVersionMajor;
  this.httpVersionMinor = this._incoming.httpVersionMinor;

  this.socket = new net.Socket( { socket: this._incoming.socket } );

  this._incoming.on("data", function(result) {
    var vbuf = new org.vertx.java.core.buffer.Buffer( result.result );
    var buf = new Buffer( vbuf );
    if ( ! this.push( buf ) ) {
      this._incoming.readStop();
    }
  }.bind(this));

  this._incoming.on( "end", function(result) {
    this.trailers    = this._incoming.trailers;
    this.push( null );
  }.bind(this));
}

util.inherits(IncomingMessage, Stream.Readable);

IncomingMessage.prototype._read = function(size) {
  this._incoming.readStart();
};

module.exports.IncomingMessage = IncomingMessage;

