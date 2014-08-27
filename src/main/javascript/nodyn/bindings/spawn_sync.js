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

function spawn(options) {
  var proc = new io.nodyn.process.SyncProcessWrap( process._process );
  var status = proc.spawn( options.files, options.args );
  var result = {
    pid: proc.pid,
    output: [
      undefined,
      process.binding('buffer').createBuffer( proc.stdout ),
      process.binding('buffer').createBuffer( proc.stderr ),
    ],
    //stdout: process.binding('buffer').createBuffer( proc.stdout ),
    //stderr: process.binding('buffer').createBuffer( proc.stderr ),
    status: status,
    signal: undefined,
    error: undefined,
  };

  Object.defineProperty( result, 'stdout', {
    get: function() {
      return this.output[1];
    },
    enumerable: true,
  });

  Object.defineProperty( result, 'stderr', {
    get: function() {
      return this.output[2];
    },
    enumerable: true,
  });

  return result;
}

module.exports.spawn = spawn;
