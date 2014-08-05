"use strict";

var util = require('util');
var Stream = require('nodyn/bindings/stream_wrap').Stream;

function TCP(tcp) {
  if ( tcp ) {
    this._tcp = tcp;
  } else {
    this._tcp = new io.nodyn.tcp.TCPWrap( process._process );
  }

  // Server
  this._tcp.on( "connection", TCP.prototype._onConnection.bind(this) );

  //Client
  this._tcp.on( "afterConnect",    TCP.prototype._onAfterConnect.bind(this) );

  Stream.call( this, this._tcp );
}

util.inherits(TCP, Stream);

// ----------------------------------------
// Server
// ----------------------------------------
TCP.prototype._onConnection = function(result) {
  var err;
  var clientHandle = new TCP( result.result );
  this.onconnection(err, clientHandle);
}

// ----------------------------------------
// Client
// ----------------------------------------

TCP.prototype._onAfterConnect = function(result) {
  // TODO don't assume success
  var status = 0;
  var handle = this;
  var readable = true;
  var writable = true;;

  var oncomplete = this._req.oncomplete;
  delete this._req.oncomplete;
  oncomplete( status, handle, this._req, readable, writable );
}

// ----------------------------------------

TCP.prototype.getpeername = function(out) {
  var remote = this._tcp.remoteAddress;
  out.address = remote.address.hostAddress;
  out.port    = remote.port;
  out.family  = ( remote.address instanceof java.net.Inet6Address ? 'IPv6' : 'IPv4' );
}

TCP.prototype.getsockname = function(out) {
  var local = this._tcp.localAddress;
  out.address = local.address.hostAddress;
  out.port    = local.port;
  out.family  = ( local.address instanceof java.net.Inet6Address ? 'IPv6' : 'IPv4' );
}

TCP.prototype.bind6 = function(addr,port) {
  return new Error( "ipv6 not supported" );
}

TCP.prototype.bind = function(addr, port) {
  this._tcp.bind( addr, port );
}

TCP.prototype.listen = function(backlog) {
  this._tcp.listen(backlog);
}

TCP.prototype.connect = function(req, addr, port) {
  this._req = req;
  this._tcp.connect(addr,port);
}

module.exports.TCP = TCP;