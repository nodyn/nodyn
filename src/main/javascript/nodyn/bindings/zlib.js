var util = require('util'),
    blocking = require('nodyn/blocking'),
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

var ZlibRequest = function ZlibRequest(delegate) {
  if (!(this instanceof ZlibRequest)) return new ZlibRequest();
  delegate.on('after', this._onAfter.bind(this));
  this._cb = undefined;
  Object.defineProperty( this, 'callback', {
    set: function(cb) { this._cb = cb; }.bind(this),
    get: function() { return this._cb; }.bind(this),
    enumerable: false
  });
};

ZlibRequest.prototype._onAfter = function _onAfter(result) {
  if (this.callback) {
    this.callback();
  }
};

ZlibRequest.prototype.run = function run(f) {
  blocking.submit(f);
  return this;
};

Zlib.prototype.write = function(flushFlag, chunk, inOffset, inLen, outBuffer, outOffset, outLen) {
  var req = new ZlibRequest(this._delegate);
  return req.run(function() {
    this._delegate.write(flushFlag, chunk._byteArray(), inOffset, inLen);
  }.bind(this));
};

Zlib.prototype.writeSync = function(flushFlag, chunk, inOffset, inLen, outBuffer, outOffset, outLen) {
  var bytes = this._delegate.writeSync(flushFlag, chunk._byteArray(), inOffset, inLen);
  return {
    AvailInAfter: 0,
    AvailOutAfter: 0
  };
};

Zlib.prototype._onError = function(result) {
  if (typeof this.onerror === 'function')
    this.onerror(result.error.message, result.result);
  else
    console.error("WTF");
};
