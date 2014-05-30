var util          = NativeRequire.require('util');
var EventEmitter  = NativeRequire.require('events').EventEmitter;

function makeEventEmitter(ctor) {
  util._extend(ctor.prototype, EventEmitter.prototype);
}
module.exports.makeEventEmitter = makeEventEmitter;

function asyncAction(blockingAction, callback) {
  process.context.executeBlocking(blockingAction, vertxHandler(callback));
}

function asyncActionOnEventLoop(action, callback) {
  process.context.runOnContext(function() {
    try {
      var result = action();
      callback(null, result);
    } catch(ex) {
      callback(ex, null);
    }
  });
}
module.exports.asyncAction = asyncActionOnEventLoop;

function vertxHandler(handler, resultConverter) {
  return function(future) {
    var result = null;
    if (handler) {
      if (future.failed()) {
        handler(new Error(future.cause()), result);
      } else {
        result = future.result();
        if (resultConverter) {
          result = resultConverter(result);
        }
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
