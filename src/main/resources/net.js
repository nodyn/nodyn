
// nodej bits
var util          = require('util')
var Stream        = require('stream')
var EventEmitter  = require('events').EventEmitter
var Dispatcher    = process.binding('Dispatcher')
var vertx         = require('vertx')

// java bits
var SocketAddress   = java.net.InetSocketAddress
var Executor        = java.util.concurrent.Executor
var Executors       = java.util.concurrent.Executors


var Server = function( connectionListener ) {

  var that = this;
  that.address = {}
  that.server = vertx.createNetServer();

  if (connectionListener) {
      that.on('connection', connectionListener);
  }

  that.listen = function(port, host, callback) {
    // TODO: This is ugly
    if (!host) {
      host = 'localhost';
    } else if (typeof(host) == 'function') {
      callback = host;
      host = 'localhost';
    }

    // activate the 'listening' callback
    if (callback) { that.on('listening', callback); }

    // setup a connection handler in vert.x
    that.server.connectHandler( function(sock) {
      nodeSocket = new Socket();
      nodeSocket.setProxy(sock);
      sock.dataHandler( function(buffer) {
        // TODO: Make this a node.js compatible buffer
        nodeSocket.emit('data', buffer);
      });
      that.emit('connection', nodeSocket);
    });

    // listen for incoming connections
    that.server.listen(port, host);

    // TODO: Vert.x does not provide bind address information?
    // server.address.family = (address.address.address.length) == 4 ? 'IPv4' : 'IPv6'
    // server.address.address = address.address.canonicalHostName
    that.address.port = port;
    that.address.host = host;

    // TODO: Vert.x does not provide notification
    // for a 'listening' event whent the server
    // has been bound, so we'll just emit the event
    // now, once we've set everything up.
    that.emit('listening');
  }

  that.close = function(callback) {
    that.server.close(function() { 
      if (callback) { that.on('close', callback); }
      that.emit('close'); 
    });
  }
}

var Socket = function() {
  var that = this;
  that.encoding = 'utf8';
  that.writable = true;

  that.setProxy = function(proxy) {
    that.proxy = proxy;
  }

  that.connect = function(port, host, connectListener) {
    if (!host) { host = 'localhost'; }
    if (connectListener) { that.on('connect', connectListener); }

    client = vertx.createNetClient();
    client.connect( port, host, function(sock) {
      that.setProxy(sock);
      that.emit('connect');
    });
  }

  that.write = function(string, encoding, callback) {
    proxy.write(data, encoding, function() {
      if (callback) { callback.apply(callback); }
    });
  }

  that.destroy = function() { 
    proxy.close(function() {
      that.writable = false;
      that.emit('close');
    });
  }

  that.end = function(data) {
    that.write(data, function() {
      that.destroy();
      that.emit('end');
    });
  }

  that.destroySoon = that.end;

  that.setEncoding = function(encoding) { 
    that.encoding = encoding;
  }

  that.pause = function() { }
  that.resume = function() { }
  that.setTimeout = function() { }
  that.setNoDelay = function() { }
  that.setKeepAlive = function() { }
  that.address = function() { }
  that.bytesRead = 0;
  that.bytesWritten = 0;
}

// Inheriting from Stream automatically makes
// us an EventEmitter too. Yay.
util.inherits(Socket, Stream);
util.inherits(Server, EventEmitter);

module.exports.Socket = Socket;
module.exports.Server = Server;
module.exports.createServer = function(connectionListener) {
  return new Server(connectionListener);
}

