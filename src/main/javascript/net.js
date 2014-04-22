var net           = NativeRequire.require('vertx/net');
var util          = NativeRequire.require('util');
var Stream        = NativeRequire.require('stream');
var nodyn         = NativeRequire.require('nodyn');

// ------------------------------------------------------------------------
// Server
// ------------------------------------------------------------------------

function Server( connectionListener ) {
  if (!(this instanceof Server)) return new Server(connectionListener);
  this.proxy = net.createNetServer();

  this.addr = {
    port: 0,
    family: "IPv4",
    address: '127.0.0.1'
  };

  if (connectionListener) {
    this.on('connection', connectionListener);
  }

  // setup a connection handler in vert.x
  this.proxy.connectHandler( function(sock) {
    // TODO: This is a hack, methinks
    this.addr.family = sock.localAddress().ipaddress.length < 20 ? 'IPv4' : 'IPv6';

    var nodeSocket = new Socket();
    nodeSocket.setProxy(sock);

    nodeSocket.on('error', function(e) { 
      this.emit('error', e);
    }.bind(this));

    this.emit('connection', nodeSocket);
  }.bind(this));
}

// Always do this BEFORE defining .prototype functions
util.inherits(Socket, Stream);

// Usage server.listen(port, [host], [backlog], [callback])
Server.prototype.listen = function() {
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
  if (callback) {
    this.on('listening', callback);
  }

  // listen for incoming connections
  this.proxy.listen(port, host, function() {
    this.addr.port      = this.proxy.port();
    this.addr.host      = this.proxy.host();
    this.addr.address   = this.proxy.host();
    this.emit('listening');
  }.bind(this));
};

Server.prototype.address = function() {
  return this.addr;
};

Server.prototype.close = function(callback) {
  if (callback) {
    this.on('close', callback);
  }

  this.proxy.close(function() {
    this.emit('close');
  }.bind(this));
};

nodyn.makeEventEmitter(Server);
module.exports.Server = Server;

module.exports.createServer = function(connectionListener) {
  return new Server(connectionListener);
};

// ------------------------------------------------------------------------
// Socket
// ------------------------------------------------------------------------

function Socket(options) {
  if (!(this instanceof Socket)) return new Socket(options);

  this.encoding  = 'utf8';
  this.writable  = true;
  this.timeoutId = null;
  this.remoteAddress = null;
  this.remotePort = null;
  this.noDelay = true;
  this.keepAlive = false;
  this.initialDelay = 0;

  this.bytesRead = 0;
  this.bytesWritten = 0;

  // TODO: Handle ctor options
  // { fd: null, type: null, allowHalfOpen: false }
}

Socket.prototype.setProxy = function(proxy) {
  this.proxy = proxy;
  if (this.proxy.remoteAddress) {
    var inetAddress = this.proxy.remoteAddress();
    this.remoteAddress = inetAddress.ipaddress;
    this.remotePort = inetAddress.port;
  }
  if (this.proxy.dataHandler) {
    this.proxy.dataHandler( function(buffer) {
      this.emit('data', new Buffer(buffer.toString()));
    }.bind(this));
  }
  if (this.proxy.endHandler) {
    this.proxy.endHandler( function() {
      this.emit('end', this);
    }.bind(this));
  }
  if (this.proxy.exceptionHandler) {
    this.proxy.exceptionHandler( function(err) {
      this.emit('error', err);
    }.bind(this));
  }
  return this;
};

// Usage socket.connect(port, [host], [callback])
Socket.prototype.connect = function(port, host, callback) {
  if (host === null || host === undefined) {
    this.host = 'localhost';
  }

  if (callback) {
    this.on('connect', callback);
  }

  net.createNetClient().connect( port, host, function(err, sock) {
    this.setProxy( sock );
    this.emit('connect', this);
  }.bind(this));
  return this;
};

// Usage socket.write(string, [encoding], [callback])
Socket.prototype.write = function() {
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
      this.proxy.drainHandler(function() {
        this.emit('drain');
        callback.apply(callback);
      }.bind(this));
    }
    // what is passed could be a buffer
    this.proxy.write(string.toString(), encoding);
};

Socket.prototype.destroy = function() {
  this.proxy.close(function() {
    this.emit('close');
  }.bind(this));
};

Socket.prototype.end = function(data, encoding) {
  if (data) {
    this.write(data, encoding, function() {
      this.destroy();
    }.bind(this));
  } else {
    this.destroy();
  }
};

Socket.prototype.destroySoon = Socket.prototype.end;

Socket.prototype.setEncoding = function(encoding) {
  this.encoding = encoding;
};

Socket.prototype.pause = function() {
  this.proxy.pause();
};

Socket.prototype.resume = function() {
  this.proxy.resume();
};

Socket.prototype.setTimeout = function(msec, timeout) {
  if (this.timeoutId) {
    clearTimeout(this.timeoutId);
    this.removeAllListeners('timeout');
  }
  if (msec > 0 && timeout) {
    this.on('timeout', timeout);
    this.timeoutId = setTimeout(function() {
      this.emit('timeout');
    }.bind(this), msec);
  }
};

Socket.prototype.setNoDelay = function(bool) {
  this.noDelay = (bool === undefined ? true : bool);
};

Socket.prototype.setKeepAlive = function(bool) {
  this.keepAlive = (bool === undefined ? true : bool);
};

Socket.prototype.ref = function() {};
Socket.prototype.unref = function() {};
Socket.prototype.address = function() {};

nodyn.makeEventEmitter(Socket);

module.exports.Socket = Socket;

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

