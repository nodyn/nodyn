vertx     = require('vertx');
process   = require('process');
console   = require('node_console');

timer     = vertx.timer;
container = vertx.container;

global.require = require;

Buffer = require('buffer').Buffer;
SlowBuffer = Buffer.SlowBuffer;

require.loadJSON = function(file) {
  return JSON.parse(vertx.fileSystem.readFileSync(file).toString());
};

setTimeout = function() {
  var args = Array.prototype.slice.call(arguments);

  if (typeof args[0] != 'function') {
    throw "setTimeout requires a callback function as the first argument";
  }
  if (typeof args[1] != 'number') {
    throw "setTimeout requires a number as the second argument";
  }
  callback = args[0];
  milliseconds = args[1];

  args.shift();  // shuffle off the func
  args.shift();  // shuffle off the timeout

  return timer.setTimer(milliseconds, function() {
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

  return timer.setPeriodic(milliseconds, function() {
    callback.apply(callback, args);
  });
};

clearTimeout = function(id) {
  timer.cancelTimer(id);
};

clearInterval = clearTimeout;


//console.log("Node.js ContextClassLoader:  " 
//    + java.lang.System.identityHashCode(java.lang.Thread.currentThread().getContextClassLoader()));

