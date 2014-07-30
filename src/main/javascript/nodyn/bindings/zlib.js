var util = require('util'),
    EventEmitter = require('events').EventEmitter;

function exportEnums(_enum) {
  for(var i=0; i<_enum.length; i++) {
    module.exports[_enum[i]] = _enum[i].ordinal();
  }
}

exportEnums(io.nodyn.zlib.Mode.values());
exportEnums(io.nodyn.zlib.Code.values());
exportEnums(io.nodyn.zlib.Strategy.values());
exportEnums(io.nodyn.zlib.Flush.values());

function Zlib(mode) {
  if (!(this instanceof Zlib)) return new Zlib(mode);
  this._delegate = new io.nodyn.zlib.NodeZlib(mode);
  this._delegate.on('error', this._onError.bind(this));
}
util.inherits(Zlib, EventEmitter);
module.exports.Zlib = Zlib;

Zlib.prototype.init = function(windowBits, level, memLevel, strategy, dictionary) {
  this._delegate.init(windowBits, level, memLevel, strategy, dictionary);
};

Zlib.prototype.params = function(level, strategy) {
  this._delegate.params(level, strategy);
};

Zlib.prototype.reset = function() {
  this._delegate.reset();
};

Zlib.prototype.close = function() {
  this._delegate.close();
};

Zlib.prototype.write = function(flushFlag, chunk, inOffset, inLen, outBuffer, outOffset, outLen) {
  var bytes = this._delegate.write(flushFlag, chunk._byteArray(), inOffset, inLen);
  //print("BYTES: " + bytes);
  //outBuffer.write(bytes, outOffset, outLen);
  //print("OUTBUFFER: "+outBuffer);
};

Zlib.prototype.writeSync = function(flushFlag, chunk, inOffset, inLen, outBuffer, outOffset, outLen) {
  var bytes = this._delegate.writeSync(flushFlag, chunk._byteArray(), inOffset, inLen);
  outBuffer.setBytes(bytes);
};

Zlib.prototype._onError = function(result) {
  if (typeof this.onerror === 'function')
    this.onerror(result.error.message, result.result);
  else
    console.error("WTF");
};
