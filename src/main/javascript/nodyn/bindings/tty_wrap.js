"use strict";

var util = require('util');
var Stream = require('nodyn/bindings/stream_wrap').Stream;

function guessHandleType(fd) {
  if ( fd <= 2 ) {
    if ( System.console() ) {
      return 'TTY';
    }
    return 'PIPE';
  }

  return 'FILE';
}

function isTTY(fd) {
  return guessHandleType(fd) == 'TTY';
}
// ----------------------------------------

function TTY(fd,readable) {
  this._stream = new io.nodyn.tty.TTYWrap(process._process, fd, readable);
  Stream.call( this, this._stream );
}

util.inherits(TTY,Stream);

TTY.prototype.getWindowSize = function(out) {
  out[0] = this._stream.getColumns();
  out[1] = this._stream.getRows();
}

TTY.prototype.setRawMode = function(rawMode) {
  this._stream.setRawMode( rawMode );
}

module.exports.guessHandleType = guessHandleType;
module.exports.isTTY = isTTY;
module.exports.TTY = TTY;