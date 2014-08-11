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
var Stream = require('nodyn/bindings/stream_wrap').Stream;

function Pipe(ipc) {
  this._pipe = new io.nodyn.pipe.PipeWrap( process._process );
  Stream.call( this, this._pipe );
}

util.inherits(Pipe, Stream);

Object.defineProperty( Pipe.prototype, 'input', {
  set: function(v) {
    this._pipe.input = v;
  }
});

Object.defineProperty( Pipe.prototype, 'output', {
  set: function(v) {
    this._pipe.output = v;
  }
} );

Pipe.prototype.bind = function() {
};

Pipe.prototype.listen = function() {
};

Pipe.prototype.connect = function() {
};

Pipe.prototype.open = function(fd) {
};

module.exports.Pipe = Pipe;
