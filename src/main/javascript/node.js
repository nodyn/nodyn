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
  var handle = process.EVENT_LOOP.newHandle();
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


  var id = process.context.setTimer(milliseconds, function() {
    callback.apply(callback, args);
    process.EVENT_LOOP.decrCount();
  });

  return {
    id: id,
    handle: handle,
  }
};

setInterval = function() {
  var handle = process.EVENT_LOOP.newHandle();
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

  var id = process.context.setPeriodic(milliseconds, function() {
    callback.apply(callback, args);
  });
  return {
    id: id,
    handle: handle,
  };
};

clearTimeout = function(handle) {
  process.context.cancelTimer(handle.id);
  handle.handle.unref();
};

clearInterval = clearTimeout;
