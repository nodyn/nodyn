
var util = require('util');
var Async = require('nodyn/bindings/async_wrap').Async

function Handle(handle) {
  this._handle = handle;
  Async.call(this, this._handle);
}

util.inherits(Handle, Async);

Handle.prototype.ref = function() {
  this._handle.ref();
}

Handle.prototype.unref = function() {
  this._handle.unref();
}

Handle.prototype.close = function() {
  this._handle.close();
}


module.exports.Handle = Handle;
