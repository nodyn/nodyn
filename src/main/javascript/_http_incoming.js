"use strict";

var net   = NativeRequire.require('net');
var util  = NativeRequire.require('util');

var EventEmitter = require('events').EventEmitter;

var Stream = NativeRequire.require('stream');
var MultiMap = NativeRequire.require('nodyn/multiMap');

function IncomingMessage(proxy) {
  if (!(this instanceof IncomingMessage)) {
    return new IncomingMessage(proxy);
  }

  Stream.Readable.call(this);
  this.encoding    = 'UTF-8';
  this.headers     = {};
  this.trailers    = {};
  this.proxy = proxy;
  this.__socket    = new net.Socket();
  this.__hasSocket = false;

  // Defer getting the socket from proxy until it's first requested.
  Object.defineProperty(this, "socket", {
    get: function() {
           if (!this.__hasSocket) {
             this.__socket.setProxy(proxy.netSocket());
           }
           return this.__socket;
         }.bind(this),
    set: function() {}, // can't set it
    configurable: true,
    enumerable: true });

  // set the headers based on what's in the proxy
  var map = new MultiMap(proxy.headers());
  map.forEach(function (name, value) {
    if (this.headers[name]) {
      this.headers[name] = this.headers[name] + "; " + value;
    } else {
      this.headers[name] = value;
    }
  }.bind(this));

  // when data arrives, emit an event
  proxy.dataHandler(function(buffer) {
    this.push( new Buffer( buffer ) );
  }.bind(this));

  // when the request/response ends make sure we deal with any
  // trailers that are a part of the message, then emit an end event
  proxy.endHandler(function() {
    if (proxy.trailers) {
      // make sure we have all the trailers from the response object
      var map = new MultiMap(proxy.trailers());
      map.forEach(function (name, value) {
        if (this.trailers[name]) {
          this.trailers[name] = this.trailers[name] + "; " + value;
        } else {
          this.trailers[name] = value;
        }
      }.bind(this));
    }
    this.push(null);
  }.bind(this));

  // Node.js uses IncomingMessage for both the server and the client
  // That makes this class a little bulky as we check the type
  // and set properties accordingly
  if (proxy.statusCode) {
    // it's a client response message
    // vert.x HttpClientResponse
    this.statusCode = proxy.statusCode();
  } else {
    // It's a server request message
    // vert.x HttpServerRequest
    this.url = proxy.uri();
    this.method = proxy.method();
    this.httpVersionMajor = 1;
    if (proxy.version().toString() === "HTTP_1_1") {
      this.httpVersionMinor = 1;
      this.httpVersion = "1.1";
    } else {
      this.httpVersionMinor = 0;
      this.httpVersion = "1.0";
    }
  }
}

util.inherits(IncomingMessage, Stream.Readable);

IncomingMessage.prototype._read = function(size) {
  this.proxy.resume();
}

IncomingMessage.prototype.setEncoding = function(enc) {
  try {
    this.encoding = java.nio.charset.Charset.forName(enc).toString();
  } catch(err) {
    console.error("Cannot find message encoding for: " + enc);
    console.error(err);
  }
};

module.exports.IncomingMessage = IncomingMessage;

