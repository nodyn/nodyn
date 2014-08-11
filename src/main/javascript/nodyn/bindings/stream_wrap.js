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
var Handle = process.binding('handle_wrap').Handle;

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
  var b = process.binding('buffer').createBuffer( result.result );
  this.onread( nread, b );
};

Stream.prototype._onEof = function(result) {
  if ( this.onread ) {
    this.onread( -1 );
  }
};

// ----------------------------------------

Stream.prototype.readStart = function() {
  this._stream.readStart();
};

Stream.prototype.readStop = function() {
  this._stream.readStop();
};

Stream.prototype.writeUtf8String = function(req,data) {
  this._stream.writeUtf8String(data);
};

Stream.prototype.writeAsciiString = function(req,data) {
  this._stream.writeAsciiString(data);
};

Stream.prototype.writeBuffer = function(req,data) {
  this._stream.write( data._nettyBuffer() );
  req.oncomplete(0, this, req );
};

Stream.prototype.shutdown = function(req) {
  this._stream.shutdown();
  req.oncomplete( 0, this, req );
};

module.exports.Stream = Stream;
