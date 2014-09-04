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

"use strict";

var util = require('util');
var Stream = process.binding('stream_wrap').Stream;

function guessHandleType(fd) {
  if ( fd <= 2 ) {
    if ( process._process.isatty( fd ) ) {
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
