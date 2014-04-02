var util = NativeRequire.require('util');

module.exports.makeEventEmitter = function(ctor) {
  util._extend(ctor.prototype, EventEmitter.prototype);
}