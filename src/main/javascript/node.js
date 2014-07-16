load('jvm-npm.js');
System = java.lang.System;
System.setProperty("java.net.preferIPv4Stack", "true");
System.setProperty("java.net.preferIPv6Addresses", "false");
Nodyn  = io.nodyn;
nodyn  = {};
global = this;

__filename = (typeof __filename === 'undefined') ?
              'node.js' : __filename;
__dirname  = (typeof __dirname === 'undefined') ?
              java.lang.System.getProperty('user.dir') : __dirname;

console    = require('console');
Buffer     = require('buffer').Buffer;
SlowBuffer = Buffer.SlowBuffer;

// Stdout and Stderr
stderr = java.lang.System.err;
stdout = java.lang.System.out;

(function() {
  var Process = require('process');
  process = new Process();
  if (process.argv[1]) {
    var path = require('path');
    process.argv[1] = path.resolve(process.argv[1]);
    print("Process argv[1] "+process.argv[1]);
    var Module = require('jvm-npm');
    Module.runMain(process.argv[1]);
  }

  var streams = require('nodyn/streams');
  Object.defineProperty( process, 'stdin', {
    get: function() {
      if ( ! this._stdin ) {
        this._stdin = new streams.InputStream( System.in );
        this._stdin._start();
        this._stdin._stream.readStop();
      }
      return this._stdin;
    }
  });

  Object.defineProperty( process, 'stdout', {
    get: function() {
      if (!this._stdout) {
        this._stdout = new streams.OutputStream( System.out );
      }
      return this._stdout;
    }
  });

  var timers = require('timers');
  setTimeout = timers.setTimeout;
  clearTimeout   = timers.clearTimeout;
  setInterval    = timers.setInterval;
  clearInterval  = timers.clearTimeout;
  setImmediate   = timers.setImmediate;
  clearImmediate = timers.clearImmediate;
})();
