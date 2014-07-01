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

  this._incoming.on("data", function(result) {
    this.push( new Buffer( result.result ) );
  }.bind(this));

  this._incoming.on( "end", function(result) {
    this.push( null );
  }.bind(this));
}

util.inherits(IncomingMessage, Stream.Readable);

IncomingMessage.prototype._read = function(size) {
  this._incoming.resume();
}

module.exports.IncomingMessage = IncomingMessage;

