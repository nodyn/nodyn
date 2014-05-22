var util          = NativeRequire.require('util');
var EventEmitter  = NativeRequire.require('events').EventEmitter;

module.exports.makeEventEmitter = function(ctor) {
  util._extend(ctor.prototype, EventEmitter.prototype);
};

module.exports.vertxHandler = function(handler, resultConverter) {
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
};

module.exports.arrayConverter = function(javaArray) {
  var arry = [];
  for (var i = 0; i < javaArray.length; i++) {
    arry.push(javaArray[i]);
  }
  return arry;
};


module.exports.notImplemented = function(name, throws) {
  return function() {
    var msg = ["Error:", name, "not implemented"].join(' ');
    print(msg);
    if (throws) {
      throw new Error(msg);
    }
  };
};
