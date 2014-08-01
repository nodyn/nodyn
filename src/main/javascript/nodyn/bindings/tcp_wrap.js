"use strict";

var util = require('util');
var Stream = require('nodyn/bindings/stream_wrap').Stream;

function TCP(tcp) {
  if ( tcp ) {
    this._tcp = tcp;
  } else {
    this._tcp = new io.nodyn.tcp.TCPWrap( process._process );
  }
  this._tcp.on( "connection", TCP.prototype._onConnection.bind(this) );

  Stream.call( this, this._tcp );
}

util.inherits(TCP, Stream);

// ----------------------------------------
TCP.prototype._onConnection = function(result) {
  var err;
  var clientHandle = new TCP( result.result );

  this.onconnection(err, clientHandle);
}
// ----------------------------------------

TCP.prototype.bind6 = function(addr,port) {
  return new Error( "ipv6 not supported" );
}

TCP.prototype.bind = function(addr, port) {
  this._tcp.bind( addr, port );
}

TCP.prototype.listen = function(backlog) {
  //console.log( "LISTEN!" );
  this._tcp.listen(backlog);
}


module.exports.TCP = TCP;