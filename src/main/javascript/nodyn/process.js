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

DTRACE_NET_SERVER_CONNECTION = function() {};
DTRACE_NET_STREAM_END        = function() {};
DTRACE_NET_SOCKET_READ       = function() {};
DTRACE_NET_SOCKET_WRITE      = function() {};
DTRACE_HTTP_SERVER_REQUEST   = function() {};
DTRACE_HTTP_SERVER_RESPONSE  = function() {};
DTRACE_HTTP_CLIENT_REQUEST   = function() {};
DTRACE_HTTP_CLIENT_RESPONSE  = function() {};

COUNTER_NET_SERVER_CONNECTION = function() {};
COUNTER_NET_SERVER_CONNECTION_CLOSE = function() {};

COUNTER_HTTP_SERVER_REQUEST = function() {};
COUNTER_HTTP_SERVER_RESPONSE = function() {};

COUNTER_HTTP_CLIENT_REQUEST = function() {};
COUNTER_HTTP_CLIENT_RESPONSE = function() {};

Number.isFinite = isFinite;

(function(javaProcess){

  function Process(process) {
    this._process = process;
    this.moduleLoadList = [];

    Object.defineProperty( this, "EVENT_LOOP", {
      get: function() {
        return this._process.eventLoop;
      }
    });

    Object.defineProperty( this, "pid", {
      get: function() {
        return this._process.pid;
      }
    });

    this.context = this._process.vertx;

    this.binding = function(name) {
      // return require(['nodyn', 'bindings', name].join('/'));
      return this._process.binding(name);
    };

    this.hrtime = function(tuple) {
      var nano = java.lang.System.nanoTime(),
          nanosPerSec = 1000000000;

      if (typeof tuple !== 'undefined') { 
        if (tuple[0] === undefined || 
            tuple[1] === undefined) {
          throw new TypeError("process.hrtime() only accepts an Array tuple.");
        }
        nano -= (tuple[0] * nanosPerSec) + tuple[1];
      }
      return [
        java.lang.Math.floor( nano / nanosPerSec ),
        nano % nanosPerSec
      ]; // seconds/nanoseconds tuple
    };

    this._setupAsyncListener = function(asyncFlags, runAsyncQueue, loadAsyncQueue, unloadAsyncQueue) {
      this._runAsyncQueue = runAsyncQueue;
      this._loadAsyncQueue = loadAsyncQueue;
      this._unloadAsyncQueue = unloadAsyncQueue;
    };

    this._setupNextTick = function(tickInfo, tickCallback) {
      this._process.setupNextTick( tickCallback );
      this._tickInfo = tickInfo;
      this._tickCallback = tickCallback;
    };

    this._setupDomainUse = function(domain, domainFlag) {
    };

    this.cwd = function() {
      return System.getProperty("user.dir");
    };

    this.execPath = this._process.execPath;
    this.execArgv = [];

    // ARGV
    this.argv = [];
    this.argv.push( this._process.argv0 );

    var rawArgv = this._process.nodyn.configuration.argv;
    if ( rawArgv ) {
      var numArgs = rawArgv.length;

      var i = 0;
      while ( i < numArgs ) {
        var arg = rawArgv[i];
        if ( arg == '-e' || arg == '--eval') {
          ++i;
          this._eval = rawArgv[i];
        } else {
          this.argv.push( rawArgv[i] );
        }
        ++i;
      }
    }

    this.env = {};

    var envMap = System.getenv();

    var keyIter = envMap.keySet().iterator();

    while ( keyIter.hasNext() ) {
      var envName = keyIter.next();
      var envVal  = envMap.get( envName );
      this.env[envName] = envVal;
    }
    if (!this.env.TMPDIR) {
      this.env.TMPDIR = java.lang.System.getProperty('java.io.tmpdir');
    }
    this.env.TEMP = this.env.TMPDIR;
    this.env.TMP = this.env.TMPDIR;

    this.arch = this._process.arch();
    this.platform = this._process.platform();
    this.version = io.nodyn.Nodyn.VERSION;
    this.versions = {
      node: io.nodyn.Nodyn.VERSION,
      java: System.getProperty('java.version')
    };

    // TODO: This should affect what is displayed in `ps`
    this.title = 'Nodyn'; 

    this.memoryUsage = function() {
      var rt = java.lang.Runtime.getRuntime();
      return {
        heapTotal: rt.totalMemory(),
        heapUsed: rt.totalMemory() - rt.freeMemory(),
        rss: rt.maxMemory()
      };
    };

    this.reallyExit = function(code) {
      this._process.exitCode = code;
      this._process.reallyExit();
      //System.exit( code );
    };

    this.umask = function(mask) {
      if (mask === null || mask === undefined) {
        // hack - posix doesn't let you pass null to get current
        // so instead, we pass an arbitrary value to get the
        // current umask, then reset to current.
        var orig = this._process.posix.umask(022);
        this._process.posix.umask(orig);
        return orig;
      }
      return this._process.posix.umask(mask);
    };

    Object.defineProperty( this, "exitCode", {
      get: function() {
        return this._process.exitCode;
      },
      set: function(v) {
        this._process.exitCode = v;
      }
    });

    Object.defineProperty( this, '_needImmediateCallback', {
      get: function() {
        return this._process.needImmediateCallback;
      },
      set: function(v) {
        this._process.needImmediateCallback = true;
      }
    });

    this._process.on('checkImmediate', function() {
      this._immediateCallback();
    }.bind(this) );

    this._posix = this._process.posix;

    this.jaropen = function(module, filename) {
      __nodyn.config.classLoader.append( filename );
      return {};
    };

    this.features = {
      debug: false,
      uv: true,
      ipv6: true,
      tls_npn: true,
      tls_sni: true,
      tls: true
    };

  }

  return new Process(javaProcess);
});
