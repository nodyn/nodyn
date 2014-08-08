/*
 * Copyright 2014 Red Hat, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

var util = require('util'),
    nodyn = require('nodyn'),
    blocking = require('nodyn/blocking'),
    EventEmitter = require('events').EventEmitter;

nodyn.exportEnums(module.exports, io.nodyn.zlib.Mode.values());
nodyn.exportEnums(module.exports, io.nodyn.zlib.Code.values());
nodyn.exportEnums(module.exports, io.nodyn.zlib.Level.values());
nodyn.exportEnums(module.exports, io.nodyn.zlib.Strategy.values());
nodyn.exportEnums(module.exports, io.nodyn.zlib.Flush.values());

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
  return new ZlibRequest(this._delegate).run(function() {
    this._delegate.write(flushFlag, chunk._byteArray(), inOffset, inLen, outBuffer._nettyBuffer(), outOffset, outLen);
  }.bind(this));
};

Zlib.prototype.writeSync = function(flushFlag, chunk, inOffset, inLen, outBuffer, outOffset, outLen) {
  this._delegate.writeSync(flushFlag, chunk._byteArray(), inOffset, inLen, outBuffer._nettyBuffer(), outOffset, outLen);
  // TODO
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

function ZlibRequest(delegate) {
  if (!(this instanceof ZlibRequest)) return new ZlibRequest();
  delegate.on('after', this._onAfter.bind(this));
}

ZlibRequest.prototype._onAfter = function _onAfter(result) {
  if (this.callback) {
    if (result.error) {
      throw new Error("Unable to process zlib request", result.error);
    }
    var inAfter = 0, outAfter = 1;
    if (result.result) {
      inAfter = result.result.inAfter;
      outAfter = result.result.outAfter;
    }
    this.callback(inAfter, outAfter);
  }
};

ZlibRequest.prototype.run = function run(f) {
  blocking.submit(f);
  return this;
};
