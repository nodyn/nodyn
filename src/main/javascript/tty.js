"use strict";

var util    = require('util');
var streams = require('nodyn/streams');

function ReadStream(terminal) {
  this._terminal = terminal;
  streams.InputStream.call( this, terminal.in );
  this.isTTY = true;
}

util.inherits( ReadStream, streams.InputStream );

ReadStream.prototype.setRawMode = function(mode) {
  this._terminal.setRawMode(mode);
}


Object.defineProperty( ReadStream.prototype, "isRaw", {
  get: function() {
    return this._terminal.isRaw();
  },
  enumerable: true,
});

module.exports.ReadStream = ReadStream;

function WriteStream(terminal) {
  this._terminal = terminal;
  streams.OutputStream.call( this, terminal.out, { decodeStrings: false }  );
  this.isTTY = true;
}

util.inherits( WriteStream, streams.OutputStream );

Object.defineProperty( WriteStream.prototype, "columns", {
  get: function() {
    return this._terminal.columns;
  },
  enumerable: true,
} );


WriteStream.prototype.isTTY = true;

module.exports.WriteStream = WriteStream;




