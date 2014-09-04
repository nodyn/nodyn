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

var Handle = process.binding('handle_wrap').Handle,
    Helper = process.binding('buffer'),
    Family = io.nodyn.udp.Family,
    util   = require('util');

function onRecv(result) { 
  if (typeof this.onmessage === 'function') {
    if (result.error) {
      throw Error(result.error); // TODO: throw here?
    }
    var buf = process.binding('buffer').createBuffer(result.result),
        remote = this._handle.remoteAddress,
        rinfo = {};
       
    if (remote) {
      rinfo.address = remote.address.hostAddress;
      rinfo.port = remote.port;
    }
    this.onmessage(buf.length, this, buf, rinfo);
  }
}

var UDP = function() {
  if (!(this instanceof UDP)) return new UDP();
  Handle.call(this, new io.nodyn.udp.UDPWrap(process._process));
  this._handle.on('recv', onRecv.bind(this));
};
util.inherits(UDP, Handle);
module.exports.UDP = UDP;

UDP.prototype.bind = function(ip, port, flags) {
  var e = this._handle.bind(ip, port, flags, Family.IPv4);
  if (e) return new Error(e.message);
};

UDP.prototype.bind6 = function(ip, port, flags) {
  var e = this._handle.bind(ip, port, flags, Family.IPv6);
  if (e) return new Error(e.message);
};

UDP.prototype.recvStart = function() {
  this._handle.recvStart();
};

UDP.prototype.send = function(req, buffer, offset, length, port, address) {
  this._handle.send(buffer._nettyBuffer(), offset, length, port, address, Family.IPv4);
  if (req.oncomplete) {
    req.oncomplete();
  }
};

UDP.prototype.send6 = function(req, buffer, offset, length, port, address) {
  this._handle.send(buffer._nettyBuffer(), offset, length, port, address, Family.IPv6);
  if (req.oncomplete) {
    req.oncomplete();
  }
};

UDP.prototype.recvStop = function() {
  this._handle.recvStop();
};

UDP.prototype.getsockname = function(out) {
  var local = this._handle.localAddress;
  out.address = local.address.hostAddress;
  out.port    = local.port;
  out.family  = ( local.address instanceof java.net.Inet6Address ? 'IPv6' : 'IPv4' );
};

UDP.prototype.addMembership = function(mcastAddr, ifaceAddr) {
  this._handle.addMembership(mcastAddr, ifaceAddr);
};

UDP.prototype.dropMembership = function() {
};

UDP.prototype.setMulticastTTL = function(arg) {
  this._handle.setMulticastTTL(arg);
};

UDP.prototype.setMulticastLoopback = function(arg) {
  this._handle.setMulticastLoopback(arg);
};

UDP.prototype.setBroadcast = function(arg) {
  this._handle.setBroadcast(arg);
};

UDP.prototype.setTTL = function(arg) {
  this._handle.setTTL(arg);
};

