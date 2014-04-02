var util          = NativeRequire.require('util');
var EventEmitter  = NativeRequire.require('events').EventEmitter;

module.exports.makeEventEmitter = function(ctor) {
  util._extend(ctor.prototype, EventEmitter.prototype);
}