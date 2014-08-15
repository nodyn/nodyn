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

var fs = require('fs'),
    util = require('util'),
    Path = require('path'),
    Handle = require('nodyn/bindings/handle_wrap').Handle;

function FSEvent() {
  this._wrap = new io.nodyn.fs.FsEventWrap( process._process );
  this[0] = _callback.bind(this);
  Handle.call( this, this._wrap );
}
util.inherits( FSEvent, Handle );

FSEvent.prototype.start = function(path, persistent, recursive) {
  path = Path.resolve(path);
  fs.statSync(path);  // throws ENOENT if not found
  this._wrap.start(path, persistent, recursive);
};

function _callback() {
  if (typeof this.onchange === 'function') {
    print(">>>>>>>>> executing callback with " + Array.prototype.splice(arguments).join(' '));
    this.onchange(arguments);
  }
  else {
      print(">>>>>>>>> curious");
  }
}

module.exports.FSEvent = FSEvent;

