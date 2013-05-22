var net           = require('vertx/net');
var timer         = require('vertx/timer');
var util          = require('util')
var Stream        = require('stream')
var EventEmitter  = require('events').EventEmitter

var Server = function( connectionListener ) {
  var proxy    = net.createNetServer();
  var that     = this;
  that.address = {}

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
    proxy.connectHandler( function(sock) {
      nodeSocket = new Socket();
      nodeSocket.setProxy(sock);
      that.emit('connection', nodeSocket);
    });

    // listen for incoming connections
    proxy.listen(port, host, function() {
      // TODO: Vert.x does not provide bind address information?
      // server.address.family = (address.address.address.length) == 4 ? 'IPv4' : 'IPv6'
      that.address.port      = port;
      that.address.host      = host;
      that.address.address   = host;
      that.emit('listening');
    });
  }

  that.address = function() {
    return that.address;
  }

  that.close = function(callback) {
    proxy.close(function() { 
      if (callback) { that.on('close', callback); }
      that.emit('close'); 
    });
  }
}

var Socket = function(options) {
  var that = this;
  that.encoding  = 'utf8';
  that.writable  = true;
  that.timeoutId = null;
  that.remoteAddress = null;
  that.remotePort = null;
  that.noDelay = true;
  that.keepAlive = false;
  that.initialDelay = 0;
  // TODO: Handle ctor options
  // { fd: null, type: null, allowHalfOpen: false }

  that.setProxy = function(proxy) {
    that.proxy = proxy;
    if (proxy.remoteAddress) {
      var inetAddress = proxy.remoteAddress();
      that.remoteAddress = inetAddress.ipaddress;
      that.remotePort = inetAddress.port;
    }
    if (proxy.dataHandler) {
      proxy.dataHandler( function(buffer) {
        print("EMITTING DATA");
        that.emit('data', new Buffer(buffer.toString()));
      });
    }
  }

  // Usage socket.connect(port, [host], [callback])
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

    client = net.createNetClient();
    client.connect( port, host, function(err, sock) {
      that.setProxy( sock );
      that.emit('connect', that);
    });
    return that;
  }

  // Usage socket.write(string, [encoding], [callback])
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
    if (data) {
      that.write(data, encoding, function() {
        that.destroy();
        that.emit('end');
      });
    } else {
      that.destroy();
      that.emit('end');
    }
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

  that.setTimeout = function(msec, timeout) { 
    if (that.timeoutId) {
      timer.cancelTimer(that.timeoutId);
    }
    if (msec > 0) {
      if (timeout) {
        that.on('timeout', timeout);
      }
      that.timeoutId = timer.setTimer(msec, function() { that.emit('timeout'); });
    }
  }

  that.setNoDelay = function(bool) { 
    that.noDelay = (bool == undefined ? true : bool);
  }

  that.setKeepAlive = function(bool) { 
    that.keepAlive = (bool == undefined ? true : bool);
  }

  that.ref = function() {}
  that.unref = function() {}
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

