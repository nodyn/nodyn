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

var blocking = new io.nodyn.loop.Blocking(process.EVENT_LOOP);

module.exports.submit = function(task) {
  blocking.submit( task );
};

module.exports.unblock = function(fn) {
  return function() {
    var origArgs = arguments;
    blocking.unblock( function() {
      fn.apply( fn.this, origArgs );
    });
  };
};

module.exports.run_unblocked = function(fn) {
  blocking.unblock( fn );
}
