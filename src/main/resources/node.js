console = require('console');
process.title = "NodeJ";

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

  return vertx.setTimer(milliseconds, function() {
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

  return vertx.setPeriodic(milliseconds, function() {
    callback.apply(callback, args);
  });
}

clearTimeout = function(id) {
  vertx.cancelTimer(id);
}

clearInterval = clearTimeout;

process.arch = "java";
process.platform = "java";
process.noDeprecation = false;
process.traceDeprecation = false;

EventEmitter               = require('events').EventEmitter
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

