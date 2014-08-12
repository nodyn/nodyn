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
  console.log( "SPAWN!" );
  console.log( options );

  for ( i = 0 ; i < options.envPairs.length ; ++i ) {
    this._process.addEnvPair( options.envPairs[i] );
  }

  for ( i = 0 ; i < options.stdio.length ; ++i ) {
    if ( i < 3 ) {
      if ( options.stdio[i].type == 'fd' ) {
        this._process.inheritStdio( i );
      }
    }
  }

  this._process.spawn( options.file, options.args );

  var stdio = options.stdio;

  for ( i = 0 ; i < stdio.length ; ++i ) {
    if ( stdio[i].type === 'pipe' ) {
      if ( i == 0 ) {
        stdio[i].handle.output = this._process.stdin
      }  else if ( i == 1 ) {
        stdio[i].handle.input  = this._process.stdout
      }  else if ( i == 2 ) {
        stdio[i].handle.input  = this._process.stderr
      } else {
        //stdio[i].handle.input  =
      }
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