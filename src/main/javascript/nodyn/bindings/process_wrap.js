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

var Pipe = process.binding( "pipe_wrap" ).Pipe;

function Process() {
  this._process = new io.nodyn.process.ProcessWrap( process._process );
  this._process.on( 'exit', Process.prototype._onExit.bind(this) );
}

Object.defineProperty( Process.prototype, 'pid', {
  get: function() {
    return this._process.pid;
  }
});

Process.prototype._onExit = function(result) {
  var exitCode = result.result[0];
  var signal   = result.result[1];
  if ( signal <= 0 ) {
    signal = undefined;
  }
  this.onexit( exitCode, signal );
}

Process.prototype.spawn = function(options) {
  for ( i = 0 ; i < options.envPairs.length ; ++i ) {
    this._process.addEnvPair( options.envPairs[i] );
  }

  for ( i = 0 ; i < options.stdio.length ; ++i ) {
    var fd;

    if ( options.stdio[i].type == 'fd' ) {
      fd = options.stdio[i].fd;
      this._process.stdio( "open", fd );
    } else if ( options.stdio[i].type == 'pipe' ) {
      options.stdio[i].handle._create(i);
      fd = options.stdio[i].handle._downstream;
      this._process.stdio( "open", fd );
      this._process.stdio( "close", options.stdio[i].handle._upstream );
    }
  }

  this._process.spawn( options.file, options.args );

  for ( i = 0 ; i < options.stdio.length ; ++i ) {
    if ( options.stdio[i].type == 'pipe' ) {
      options.stdio[i].handle.closeDownstream();
    }
  }
}

Process.prototype.close = function() {
  // what, exactly, should we do here?
}

Process.prototype.kill = function(signal) {
  this._process.kill( signal );
}

module.exports.Process = Process;