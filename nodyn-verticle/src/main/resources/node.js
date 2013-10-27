var javaProcess = new org.projectodd.nodyn.process.Process();
vertx     = require('vertx');
process   = require('process');
console   = require('node_console');

timer     = vertx.timer;
container = vertx.container;

process.title = "Nodyn";
global.require = require;

process.stdout = {
  write: function(message) {
    java.lang.System.out.print(message);
  }
}

process.stderr = {
  write: function(message) {
    java.lang.System.err.print(message);
  }
}

// TODO: Fix this
process.stdin = {
  read: function() {
  }
}

Buffer = require('buffer').Buffer;
SlowBuffer = Buffer.SlowBuffer;

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
}

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
}

clearTimeout = function(id) {
  timer.cancelTimer(id);
}

clearInterval = clearTimeout;

process.arch = javaProcess.arch();
process.platform = javaProcess.platform();
process.noDeprecation = false;
process.traceDeprecation = false;

EventEmitter               = require('events').EventEmitter
process.EventEmitter       = EventEmitter
process.on                 = EventEmitter.prototype.on
process.addListener        = EventEmitter.prototype.addListener
process.once               = EventEmitter.prototype.once
process.removeListener     = EventEmitter.prototype.removeListener
process.removeAllListeners = EventEmitter.prototype.removeAllListeners
process.setMaxListeners    = EventEmitter.prototype.setMaxListeners
process.listeners          = EventEmitter.prototype.listeners
process.emit               = EventEmitter.prototype.emit

// dynjs.global.__filename = __node.getFilename();
// dynjs.global.__dirname  = __node.getDirname();

process.memoryUsage = function() {
  os = require('os');
  var obj = {};
  obj.heapTotal = os.totalmem();
  obj.heapUsed  = os.totalmem() - os.freemem();
  return obj;
}

process.nextTick = function(callback, args) {
  vertx.runOnContext(function() {
    callback(args);
  });
}

// TODO: process.config
// Node.js puts the configure options that were used to compile the current
// node executable in process.config
process.config = {}

//console.log("Node.js ContextClassLoader:  " 
//    + java.lang.System.identityHashCode(java.lang.Thread.currentThread().getContextClassLoader()));

