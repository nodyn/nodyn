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

var Handle = require('nodyn/bindings/handle_wrap').Handle,
    Buffer = require('nodyn/bindings/buffer'),
    Family = io.nodyn.udp.Family,
    util   = require('util');

function onRecv(result) { // [nread, buffer, remoteAddress, remotePort]
  if (typeof this.onmessage === 'function') {
    if (result.error) throw Error(result.error); // TODO: throw here?
    result = result.result();
    var rinfo = {
      address: result[2],
      port: result[3]
    };
    this.onmessage(result[0], this, Buffer.createBuffer(result[1]), rinfo);
  }
}

var UDP = function() {
  if (!(this instanceof UDP)) return new UDP();
  Handle.call(this, new io.nodyn.udp.UDPWrap(process._process));
};
util.inherits(UDP, Handle);
module.exports.UDP = UDP;

UDP.prototype.bind = function(ip, port, flags) {
  return this._handle.bind(ip, port, flags, Family.IPv4);
};

UDP.prototype.bind6 = function(ip, port, flags) {
  return this._handle.bind(ip, port, flags, Family.IPv6);
};

UDP.prototype.recvStart = function() {
  this._handle.on('recv', onRecv.bind(this));
  this._handle.recvStart();
};

UDP.prototype.send = function(req, buffer, offset, length, port, address) {
  // TODO: Do we ignore req? It's just a JS object with two properties
  // 'buffer' and 'length', but we're already getting the buffer itself
  this._handle.send(buffer._nettyBuffer(), offset, length, port, address, Family.IPv4);
};

UDP.prototype.send6 = function(req, buffer, offset, length, port, address) {
  // TODO: Do we ignore req? It's just a JS object with two properties
  // 'buffer' and 'length', but we're already getting the buffer itself
  this._handle.send(buffer._nettyBuffer(), offset, length, port, address, Family.IPv6);
};

UDP.prototype.recvStop = function() {
  this._handle.recvStop();
};

UDP.prototype.getsockname = function() {
};

UDP.prototype.addMembership = function() {
};

UDP.prototype.dropMembership = function() {
};

UDP.prototype.setMulticastTTL = function() {
};

UDP.prototype.setMulticastLoopback = function() {
};

UDP.prototype.setBroadcast = function() {
};

UDP.prototype.setTTL = function() {
};

