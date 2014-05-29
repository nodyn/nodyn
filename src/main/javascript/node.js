load('jvm-npm.js');
System = java.lang.System;
Nodyn  = org.projectodd.nodyn;
nodyn  = {
  QueryString: Nodyn.util.QueryString.newQueryString(this)
};
global = this;

process = (function() {
  var Process = NativeRequire.require('process');
  return new Process();
})();
global.__jvertx = process.context;

__filename = (typeof __filename === 'undefined') ?
              'node.js' : __filename;
__dirname  = (typeof __dirname === 'undefined') ?
              java.lang.System.getProperty('user.dir') : __dirname;

console    = NativeRequire.require('node_console');
Buffer     = require('buffer').Buffer;
SlowBuffer = Buffer.SlowBuffer;

// Stdout and Stderr
stderr = java.lang.System.err;
stdout = java.lang.System.out;

setTimeout = function() {
  var args = Array.prototype.slice.call(arguments);

  if (typeof args[0] != 'function') {
    throw "setTimeout requires a callback function as the first argument";
  }
  if (typeof args[1] != 'number') {
    throw "setTimeout requires a number as the second argument";
  }
  var callback = args[0];
  var milliseconds = args[1];
  if (milliseconds === 0) milliseconds = 1;

  args.shift();  // shuffle off the func
  args.shift();  // shuffle off the timeout

  return process.context.setTimer(milliseconds, function() {
    callback.apply(callback, args);
  });
};

setInterval = function() {
  var args = Array.prototype.slice.call(arguments);

  if (typeof args[0] != 'function') {
    throw "setInterval requires a callback function as the first argument";
  }
  if (typeof args[1] != 'number') {
    throw "setInterval requires a number as the second argument";
  }
  callback = args[0];
  milliseconds = args[1];

  args.shift();  // shuffle off the func
  args.shift();  // shuffle off the timeout

  return process.context.setPeriodic(milliseconds, function() {
    callback.apply(callback, args);
  });
};

clearTimeout = function(id) {
  process.context.cancelTimer(id);
};

clearInterval = clearTimeout;
