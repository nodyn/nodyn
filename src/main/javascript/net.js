var util          = NativeRequire.require('util');
var Stream        = NativeRequire.require('stream');
var nodyn         = NativeRequire.require('nodyn');
var EventEmitter = require('events').EventEmitter;

// ------------------------------------------------------------------------
// Server
// ------------------------------------------------------------------------

function Server(connectionListener) {
  EventEmitter.call( this );
  this._server = this._createServer();

  if ((typeof connectionListener) === 'function') {
    this.on('connection', connectionListener);
  }

  this._server.on('listening', function(result) {
    this.emit( "listening" );
  }.bind(this));

  this._server.on('connection', function(result) {
    this.emit('connection', new Socket({
      socket: result.result
    }));
  }.bind(this));

  this._server.on('close', function(result) {
    this.emit( 'close' );
  }.bind(this));

  this._server.on('error', function(result) {
    this.emit('error', result.result );
  }.bind(this));
}

Server.prototype._createServer = function() {
  return new io.nodyn.net.NetServerWrap(process.EVENT_LOOP);
}

Server.prototype.ref = function() {
  this._server.ref();
};

Server.prototype.unref = function() {
  this._server.unref();
};

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
  this._server.listen(port, host);
};

Server.prototype.address = function() {
  return {
    port:    this._server.localPort,
    address: this._server.localAddress,
    family:  this._server.localAddressFamily,
  };
};

Server.prototype.close = function(callback) {
  if (callback) {
    this.on('close', callback);
  }

  this._server.close();
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
  EventEmitter.call(this);
  Stream.Duplex.call(this);

  if ( options && options.socket ) {
    this._socket = options.socket;
  } else {
    this._socket = new io.nodyn.net.SocketWrap(process.EVENT_LOOP);
  }

  this._socket.on( 'connect', function(result) {
    this.emit( 'connect', this );
  }.bind(this));

  this._socket.on( 'data', function(result) {
    var vbuf = new org.vertx.java.core.buffer.Buffer( result.result );
    var buf = new Buffer( vbuf );
    if ( ! this.push( buf ) ) {
      this._socket.readStop();
    }
  }.bind(this));

  this._socket.on( 'end', function(result) {
    this.push( null );
  }.bind(this));

  this._socket.on( 'close', function(result) {
    this.emit('close');
  }.bind(this));

  this._socket.on( 'timeout', function(result) {
    this.emit('timeout');
  }.bind(this));
}

// Always do this BEFORE defining .prototype functions
util.inherits(Socket, Stream.Duplex);

nodyn.makeEventEmitter(Socket);

Socket.prototype.ref = function() {
  this._socket.ref();
};

Socket.prototype.unref = function() {
  this._socket.unref();
};

// Usage socket.connect(port, [host], [callback])
Socket.prototype.connect = function(port, host, callback) {
  if (host === null || host === undefined) {
    this.host = 'localhost';
  }

  if (callback) {
    this.on('connect', callback);
  }

  this._socket.connect( port, host );
};

Socket.prototype._write = function(chunk,encoding,callback) {
  if ( chunk instanceof Buffer ) {
    this._socket.write( chunk.delegate.byteBuf );
  }

  callback();
};

Socket.prototype._read = function(size) {
  this._socket.readStart();
};

Socket.prototype.destroy = function() {
  this._socket.destroy();
};

Socket.prototype.end = function(data, encoding) {
  this.destroy();
};

Socket.prototype.setTimeout = function(msec, timeout) {
  if ( timeout ) {
    this.on( "timeout", timeout );
  }
  this._socket.setTimeout( msec );
};

Socket.prototype.setKeepAlive = function(enable, delay) {
  if ( enable ) {
    this._socket.setKeepAlive(enable);
  } else {
    this._socket.setKeepAlive(false);
  }
};

Socket.prototype.setNoDelay = function(noDelay) {
  if ( !noDelay ) {
    this._socket.setNoDelay(true);
  } else {
    this._socket.setNoDelay(false);
  }
};

Object.defineProperty( Socket.prototype, "remoteAddress", {
  get: function() {
    return this._socket.remoteAddress.address.hostAddress.toString();
  },
  enumerable: true,
});

Object.defineProperty( Socket.prototype, "remotePort", {
  get: function() {
    return this._socket.remoteAddress.port;
  },
  enumerable: true,
});


//Socket.prototype.setNoDelay = function(bool) {
  //this.noDelay = (bool === undefined ? true : bool);
//};

//Socket.prototype.setKeepAlive = function(bool) {
  //this.keepAlive = (bool === undefined ? true : bool);
//};


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
  } else if (typeof(args[0]) == 'number') {
    options.port = args[0];
    if (typeof(args[1]) == 'string') {
      options.host = args[1];
    }
  }

  lastArg = args[args.length - 1];
  if (typeof lastArg  == 'function') {
    callback = lastArg;
  }

  socket = new Socket();
  if ( options.allowHalfOpen ) {
    socket.allowHalfOpen = options.allowHalfOpen;
  }

  socket.connect(options.port, options.host, callback );
  return socket;
};

module.exports.connect = module.exports.createConnection;
