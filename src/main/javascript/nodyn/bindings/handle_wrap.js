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

var util = require('util');
var Async = process.binding('async_wrap').Async;

function Handle(handle) {
  this._handle = handle;
  Async.call(this, this._handle);
}

util.inherits(Handle, Async);

Handle.prototype.ref = function() {
  this._handle.ref();
};

Handle.prototype.unref = function() {
  this._handle.unref();
};

Handle.prototype.close = function(callback) {
  this._handle.close();
  if ( callback ) {
    callback.call( this );
  }
};


module.exports.Handle = Handle;
