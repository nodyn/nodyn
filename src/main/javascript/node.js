load('jvm-npm.js');
System = java.lang.System;
System.setProperty("java.net.preferIPv4Stack", "true");
System.setProperty("java.net.preferIPv6Addresses", "false");
Nodyn  = io.nodyn;
nodyn  = {};
global = this;

process = (function() {
  var Process = NativeRequire.require('process');
  return new Process();
})();

//process.stdin = new (require('nodyn/streams').InputStream)( System.in );
//process.stdin._start();
//process.stdin._stream.readStop();

Object.defineProperty( process, 'stdin', {
  get: function() {
    if ( ! this._stdin ) {
      this._stdin = new (require('nodyn/streams').InputStream)( System.in );
      this._stdin._start();
      this._stdin._stream.readStop();
    }
    return this._stdin;
  }
});

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
  var timers = require('timers');
  setTimeout = timers.setTimeout;
  clearTimeout   = timers.clearTimeout;
  setInterval    = timers.setInterval;
  clearInterval  = timers.clearTimeout;
  setImmediate   = timers.setImmediate;
  clearImmediate = timers.clearImmediate;
})();
