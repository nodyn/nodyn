var util          = require('util')
var Stream        = require('stream')
var EventEmitter  = require('events').EventEmitter
var Dispatcher    = process.binding('Dispatcher')
var vertx         = require('vertx')


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

    // TODO: Vert.x does not provide notification for a 'listening' event whent the server
    // has been bound, so we'll just emit the event now, once we've set everything up.
    that.emit('listening');
  }

  that.close = function(callback) {
    that.server.close(function() { 
      if (callback) { that.on('close', callback); }
      that.emit('close'); 
    });
  }
}

var Socket = function(options) {
  var that = this;
  that.encoding = 'utf8';
  that.writable = true;
  // TODO: Handle ctor options
  // { fd: null, type: null, allowHalfOpen: false }

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

  that.end = function(data, encoding) {
    // TODO: HANDLE ENCODING
    that.write(data, function() {
      that.destroy();
      that.emit('end');
    });
  }
  that.destroySoon = that.end;

  that.setEncoding = function(encoding) { 
    that.encoding = encoding;
  }

  that.pause = function() { 
    that.proxy.pause();
  }
  that.resume = function() { 
    that.proxy.resume();
  }

  that.setTimeout = function() { }
  that.setNoDelay = function() { }
  that.setKeepAlive = function() { }
  that.address = function() { }
  that.bytesRead = 0;
  that.bytesWritten = 0;
}

// Inheriting from Stream makes Socket an EventEmitter.
util.inherits(Socket, Stream);
util.inherits(Server, EventEmitter);

module.exports.Socket = Socket;
module.exports.Server = Server;

module.exports.createServer = function(connectionListener) {
  return new Server(connectionListener);
}

module.exports.createConnection = function() {
  options           = {}
  options.host      = 'localhost';
  options.port      = null;
  options.localAddr = null;
  callback          = null;

  if (typeof(arguments[0]) == 'object') {
    options.port = arguments[0].port;

    if (arguments[0].host) { 
      options.host = arguments[0].host; 
    }
    if (arguments[0].localAddress) { 
      options.localAddr = arguments[0].localAddress; 
    }
    if (typeof(arguments[1]) == 'function') { 
      callback = arguments[1]; 
    }
  } 
  else if (typeof(arguments[0]) == 'number') {
    options.port = arguments[0];
    if (typeof(arguments[1]) == 'string') { 
      options.host = arguments[1]; 
    }
    else if (typeof(arguments[1] == 'function')) { 
      callback = arguments[1]; 
    }
  }

  sock = new Socket();
  sock.connect(options.port, options.host, callback);
}
module.exports.connect = module.exports.createConnection;

