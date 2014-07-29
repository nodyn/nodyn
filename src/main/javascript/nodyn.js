var util          = require('util');
var EventEmitter  = require('events').EventEmitter;

function makeEventEmitter(ctor) {
  util._extend(ctor.prototype, EventEmitter.prototype);
}
module.exports.makeEventEmitter = makeEventEmitter;

/**
 * Executes blockingAction asynchronously on a worker thread. To indicate
 * failure, blockingAction should return an instance of Error. Any other
 * value will be considered success. The callback function will be called
 * with the Error returned as the first parameter in the case of failure.
 * Otherwise, it will be called with (null, <blockingAction's return value>).
 */
function asyncAction(blockingAction, callback) {
  var handle = process.EVENT_LOOP.newHandle();
  process.context.executeBlocking(blockingAction, function(future) {
    if (future.result() instanceof Error) {
      callback(future.result(), null);
    } else if (future.failed()) {
      callback(future.cause().getValue(), null);
    } else {
      callback(null, future.result());
    }
    handle.unref();
  });
}
module.exports.asyncAction = asyncAction;

function vertxHandler(handler, resultConverter, errorConverter) {
  return function(future) {
    if (handler) {
      if (future.failed()) {
        var cause = future.cause();
        var error = errorConverter ? errorConverter(cause) : new Error(cause);
        error.cause = cause;
        handler(error, null);
      } else {
        var result = resultConverter ? resultConverter(future.result()) : future.result();
        handler(null, result);
      }
    }
  };
}
module.exports.vertxHandler = vertxHandler;

function arrayConverter(javaArray) {
  var arry = [];
  for (var i = 0; i < javaArray.length; i++) {
    arry.push(javaArray[i]);
  }
  return arry;
}
module.exports.arrayConverter = arrayConverter;

function notImplemented(name, throws) {
  return function() {
    var msg = ["Error:", name, "not implemented"].join(' ');
    print(msg);
    if (throws) {
      throw new Error(msg);
    }
  };
}
module.exports.notImplemented = notImplemented;
