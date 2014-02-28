var net           = NativeRequire.require('vertx/net');
var timer         = NativeRequire.require('vertx/timer');
var util          = NativeRequire.require('util');
var Stream        = NativeRequire.require('stream');
var EventEmitter  = NativeRequire.require('events').EventEmitter;

function Server( connectionListener ) {
  var proxy    = net.createNetServer();
  var that     = this;
  that.addr    = {
    port: 0,
    family: "IPv4",
    address: '127.0.0.1'
  };

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
      // TODO: This is a hack, methinks
      that.addr.family = sock.localAddress().ipaddress.length < 20 ? 'IPv4' : 'IPv6';
      that.emit('connection', nodeSocket);
    });

    // listen for incoming connections
    proxy.listen(port, host, function() {
      that.addr.port      = proxy.port();
      that.addr.host      = proxy.host();
      that.addr.address   = proxy.host();
      that.emit('listening');
    });
  };

  that.address = function() {
    return that.addr;
  };

  that.close = function(callback) {
    proxy.close(function() { 
      if (callback) { that.on('close', callback); }
      that.emit('close'); 
    });
  };
}

function Socket(options) {
  var that = this;
  this.encoding  = 'utf8';
  this.writable  = true;
  this.timeoutId = null;
  this.remoteAddress = null;
  this.remotePort = null;
  this.noDelay = true;
  this.keepAlive = false;
  this.initialDelay = 0;
  // TODO: Handle ctor options
  // { fd: null, type: null, allowHalfOpen: false }

  this.setProxy = function(proxy) {
    that.proxy = proxy;
    if (proxy.remoteAddress) {
      var inetAddress = proxy.remoteAddress();
      that.remoteAddress = inetAddress.ipaddress;
      that.remotePort = inetAddress.port;
    }
    if (proxy.dataHandler) {
      proxy.dataHandler( function(buffer) {
        that.emit('data', new Buffer(buffer.toString()));
      });
    }
    return that;
  };

  // Usage socket.connect(port, [host], [callback])
  this.connect = function(port, host, callback) {
    if (host === null || host === undefined) {
      host = 'localhost';
    }
    if (typeof callback  == 'function') {
      that.on('connect', callback);
    }

    client = net.createNetClient();
    client.connect( port, host, function(err, sock) {
      that.setProxy( sock );
      that.emit('connect', that);
    });
    return that;
  };

  // Usage socket.write(string, [encoding], [callback])
  this.write = function() {
    var args = Array.prototype.slice.call(arguments);
    callback = null;
    encoding = 'UTF-8';
    string   = args[0];
    lastArg  = args[args.length - 1];

    if (typeof lastArg  == 'function') {
      callback = lastArg;
    }
    if (typeof args[1] == 'string') {
      encoding = args[1];
    }

    if (callback) {
      that.proxy.drainHandler(function() {
        callback.apply(callback);
      });
    }
    // what is passed could be a buffer
    that.proxy.write(string.toString(), encoding);
  };

  this.destroy = function() { 
    that.proxy.close(function() {
      that.emit('close');
    });
  };

  this.end = function(data, encoding) {
    if (data) {
      that.write(data, encoding, function() {
        that.destroy();
        that.emit('end');
      });
    } else {
      that.destroy();
      that.emit('end');
    }
  };

  this.destroySoon = that.end;

  this.setEncoding = function(encoding) { 
    that.encoding = encoding;
  };

  this.pause = function() { 
    that.proxy.pause();
  };
  this.resume = function() { 
    that.proxy.resume();
  };

  this.setTimeout = function(msec, timeout) { 
    if (that.timeoutId) {
      timer.cancelTimer(that.timeoutId);
      that.removeAllListeners('timeout');
    }
    if (msec > 0 && timeout) {
      that.on('timeout', timeout);
      that.timeoutId = timer.setTimer(msec, function() { that.emit('timeout'); });
    }
  };

  this.setNoDelay = function(bool) { 
    that.noDelay = (bool === undefined ? true : bool);
  };

  this.setKeepAlive = function(bool) { 
    that.keepAlive = (bool === undefined ? true : bool);
  };

  this.ref = function() {};
  this.unref = function() {};
  this.address = function() {};
  this.bytesRead = 0;
  this.bytesWritten = 0;
}

// Inheriting from Stream makes Socket an EventEmitter.
util.inherits(Socket, Stream);
util.inherits(Server, EventEmitter);

module.exports.Socket = Socket;
module.exports.Server = Server;

module.exports.createServer = function(connectionListener) {
  return new Server(connectionListener);
};

module.exports.createConnection = function() {
  options           = {};
  options.host      = 'localhost';
  options.port      = null;
  options.localAddr = null;
  callback          = null;

  var args = Array.prototype.slice.call(arguments);
  if (typeof(args[0]) == 'object') {
    options.port = args[0].port;

    if (args[0].host) { 
      options.host = args[0].host; 
    }
    if (args[0].localAddress) { 
      options.localAddr = args[0].localAddress; 
    }
  } 
  else if (typeof(args[0]) == 'number') {
    options.port = args[0];
    if (typeof(args[1]) == 'string') { 
      options.host = args[1]; 
    }
  }
  lastArg = args[args.length - 1];
  if (typeof lastArg  == 'function') {
    callback = lastArg;
  }

  sock = new Socket();
  sock.connect(options.port, options.host, callback);
  return sock;
};
module.exports.connect = module.exports.createConnection;

