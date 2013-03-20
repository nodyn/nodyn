var util          = require('util')
var Stream        = require('stream')
var EventEmitter  = require('events').EventEmitter

var Server = function( connectionListener ) {

  var that = this;
  that.address = {}
  that.server = vertx.__vertx.createNetServer();

  if (connectionListener) {
      that.on('connection', connectionListener);
  }

  // Usage server.listen(port, [host], [backlog], [callback])
  that.listen = function() {
    callback = null;
    host = '0.0.0.0';
    port = arguments[0];
    lastArg = arguments[arguments.length - 1];

    if (typeof lastArg  == 'function') {
      callback = lastArg;
    }
    if (typeof arguments[1]  == 'string') {
      host = arguments[1];
    }

    // activate the 'listening' callback
    if (callback) { that.on('listening', callback); }

    // setup a connection handler in vert.x
    that.server.connectHandler( function(sock) {
      nodeSocket = new Socket();
      nodeSocket.setProxy(sock);
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
    that.proxy.dataHandler( function(buffer) {
      // TODO: Make this a node.js compatible buffer
      that.emit('data', buffer.toString());
    });
  }

  // Usage net.connect(port, [host], [callback])
  that.connect = function() {
    callback = null;
    host = 'localhost';
    port = arguments[0];
    lastArg = arguments[arguments.length - 1];

    if (typeof lastArg  == 'function') {
      that.on('connect', lastArg);
    }
    if (typeof arguments[1]  == 'string') {
      host = arguments[1];
    }

    client = vertx.__vertx.createNetClient();
    client.connect( port, host, function(sock) {
      that.setProxy( sock );
      that.emit('connect');
    });
    return that;
  }

  // Usage net.connect(string, [encoding], [callback])
  that.write = function() {
    encoding = 'UTF-8';
    string   = arguments[0];
    lastArg  = arguments[arguments.length - 1];

    if (typeof lastArg  == 'function') {
      callback = lastArg;
    }
    if (typeof arguments[1] == 'string') {
      encoding = arguments[1];
    }

    that.proxy.write(string, encoding, function() {
      if (callback) { callback.apply(callback); }
    });
  }

  that.destroy = function() { 
    that.emit('close');
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
  return sock;
}
module.exports.connect = module.exports.createConnection;

