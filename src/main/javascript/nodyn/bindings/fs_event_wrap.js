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

var util = require('util'),
    Handle = process.binding('handle_wrap').Handle;

function FSEvent() {
  this._wrap = new io.nodyn.fs.FsEventWrap(process._process);
  this._wrap.on('change', _callback.bind(this));
  Handle.call( this, this._wrap );
}
util.inherits( FSEvent, Handle );

FSEvent.prototype.start = function(path, persistent, recursive) {
  path = require('path').resolve(path);
  fs.statSync(path);  // throws ENOENT if not found
  this._wrap.start(path, persistent, recursive);
};

function _callback(result) {
  if (typeof this.onchange === 'function') {
    if (result.error) {
      // TODO: fs.js looks up the errno
      this.onchange(-1);
      return;
    }
    var event = result.result[0];
    var name  = result.result[1];
    switch(event) {
      case 'ENTRY_MODIFY':
        event = 'change';
        break;
      case 'ENTRY_CREATE':
        event = 'create';
        break;
      case 'ENTRY_DELETE':
        event = 'delete';
        break;
    }
    this.onchange(0, event, name);
  }
}

module.exports.FSEvent = FSEvent;

