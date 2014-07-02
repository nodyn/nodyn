var util  = NativeRequire.require('util');
var nodyn = NativeRequire.require('nodyn');
var Stream = NativeRequire.require('stream');
var EventEmitter = require('events').EventEmitter;
var IncomingMessage = require('_http_incoming').IncomingMessage;
var Buffer = require("buffer").Buffer;
var net           = require('net');

function Server(requestListener) {
  net.Server.call( this );
  //this._server.maxHeadersCount = 1000;

  this._server.on('request',       this._onRequest.bind(this));
  this._server.on('checkContinue', this._onCheckContinue.bind(this));
  this._server.on('connect',       this._onConnect.bind(this));
  this._server.on('upgrade',       this._onUpgrade.bind(this));

  if (requestListener) {
    this.on('request', requestListener);
  }
}

util.inherits(Server, net.Server);

Object.defineProperty( Server.prototype, "timeout", {
  get: function() {
    return this._server.timeout;
  },
  set: function(v) {
    this._server.timeout = v;
  },
  enumerable: true,
});

Object.defineProperty( Server.prototype, "maxHeadersCount", {
  get: function() {
    return this._server.maxHeadersCount;
  },
  set: function(v) {
    this._server.maxHeadersCount = v;
  },
  enumerable: true,
});

Server.prototype._createServer = function() {
  return new io.nodyn.http.server.HttpServerWrap(process.EVENT_LOOP);
}

Server.prototype._onRequest = function(result) {
  var request  = result.result[0];
  var response = result.result[1];
  var incomingMessage = new IncomingMessage(request);
  var serverResponse  = new ServerResponse(response);
  this.emit( 'request', incomingMessage, serverResponse );
}

Server.prototype._onCheckContinue = function(result) {
  var request  = result.result[0];
  var response = result.result[1];
  var incomingMessage = new IncomingMessage(request);
  var serverResponse  = new ServerResponse(response);

  if ( this.listeners('checkContinue').length == 0 ) {
    serverResponse.writeContinue();
    return;
  }
  this.emit( 'checkContinue', incomingMessage, serverResponse );
}

Server.prototype._onConnect = function(result) {
  var request  = result.result;

  if ( this.listeners('connect').length == 0 ) {
    request.socket.destroy();
    return;
  }
  var incomingMessage = new IncomingMessage(request);
  this.emit( 'connect', incomingMessage, incomingMessage.socket );
}

Server.prototype._onUpgrade = function(result) {
  var request  = result.result;

  if ( this.listeners('upgrade').length == 0 ) {
    request.socket.destroy();
    return;
  }
  var incomingMessage = new IncomingMessage(request);
  this.emit( 'upgrade', incomingMessage, incomingMessage.socket );
}

//nodyn.makeEventEmitter(Server);
module.exports.Server = Server;

module.exports.createServer = function(connectionListener) {
  return new Server(requestListener);
};

function handleUpgrade(server, incomingMessage) {
  // Bypass vert.x's builtin websocket handler and let the poor node.js
  // developers do all the hard work on their own.
  if (server.listeners('upgrade').length > 0) {
    server.emit('upgrade', incomingMessage, incomingMessage.socket, new Buffer());
  } else {
    // If nobody is listening for an upgrade event, then the
    // connection is closed, per the Node.js API
    incomingMessage.socket.end();
  }
}

function handleConnect(server, incomingMessage, serverResponse) {
  if (server.listeners('connect').length > 0) {
    server.emit('connect', incomingMessage, incomingMessage.socket, new Buffer());
  } else {
    // close the connection per the node.js api
    serverResponse.emit('close');
    serverResponse.end();
  }
}

function ServerResponse(response) {
  Stream.Writable.call(this);
  Object.defineProperty(this, "_response", {
    value: response,
    configurable: true,
    enumerable: false });
}

util.inherits(ServerResponse, Stream.Writable);

ServerResponse.prototype.end = function( data, encoding, callback ) {
  if ( data ) {
    Stream.Writable.prototype.write.call( this, data, encoding, callback );
  }
  this._response.end();
  Stream.Writable.prototype.end.call( this );
};

ServerResponse.prototype.writeHead = function( statusCode /*, reasonPhrase, headers */) {
  var args = Array.prototype.slice.call(arguments, 1);
  var reasonPhrase;
  var headers = {};

  var last = args.pop();
  switch(typeof last) {
    case 'object':
      reasonPhrase = args.pop();
      headers = last;
      break;
    case 'string':
      reasonPhrase = last;
      break;
  }

  if ( headers ) {
    for ( h in headers ) {
      this.setHeader(h, headers[h] );
    }
  }

  this._response.writeHead( statusCode, reasonPhrase );
};

Object.defineProperty(ServerResponse.prototype, 'sendDate', {
  get: function(){
    return this._response.sendDate;
  },
  set: function(v) {
    this._response.sendDate = v;
  },
  enumerable: true,
});

Object.defineProperty(ServerResponse.prototype, 'headersSent', {
  get: function(){
    return this._response.headersSent;
  },
  enumerable: true,
});

Object.defineProperty(ServerResponse.prototype, 'statusCode', {
  set: function(v) {
    this._response.statusCode = v;
  },
  get: function() {
    return this._response.statusCode;
  },
  enumerable: true,
});

ServerResponse.prototype._write = function(chunk, encoding, callback) {
  if ( chunk instanceof Buffer ) {
    this._response.write(chunk.delegate.byteBuf);
  }
  callback();
};

ServerResponse.prototype.getHeader = function(name) {
  return this._response.headers.get(name);
};

ServerResponse.prototype.setHeader = function(name, value) {
  this._response.headers.set(name, value.toString());
};

ServerResponse.prototype.removeHeader = function(name) {
  this._response.headers.remove(name);
};

ServerResponse.prototype.addTrailers = function(trailers) {
  for( var t in trailers ) {
    this._response.trailers.set(t, trailers[t]);
  }
};

ServerResponse.prototype.writeContinue = function() {
  this._response.writeContinue();
};

nodyn.makeEventEmitter(ServerResponse);
module.exports.ServerResponse = ServerResponse;

var STATUS_CODES = exports.STATUS_CODES = {
  100 : 'Continue',
  101 : 'Switching Protocols',
  102 : 'Processing',                 // RFC 2518, obsoleted by RFC 4918
  200 : 'OK',
  201 : 'Created',
  202 : 'Accepted',
  203 : 'Non-Authoritative Information',
  204 : 'No Content',
  205 : 'Reset Content',
  206 : 'Partial Content',
  207 : 'Multi-Status',               // RFC 4918
  300 : 'Multiple Choices',
  301 : 'Moved Permanently',
  302 : 'Moved Temporarily',
  303 : 'See Other',
  304 : 'Not Modified',
  305 : 'Use Proxy',
  307 : 'Temporary Redirect',
  400 : 'Bad Request',
  401 : 'Unauthorized',
  402 : 'Payment Required',
  403 : 'Forbidden',
  404 : 'Not Found',
  405 : 'Method Not Allowed',
  406 : 'Not Acceptable',
  407 : 'Proxy Authentication Required',
  408 : 'Request Time-out',
  409 : 'Conflict',
  410 : 'Gone',
  411 : 'Length Required',
  412 : 'Precondition Failed',
  413 : 'Request Entity Too Large',
  414 : 'Request-URI Too Large',
  415 : 'Unsupported Media Type',
  416 : 'Requested Range Not Satisfiable',
  417 : 'Expectation Failed',
  418 : 'I\'m a teapot',              // RFC 2324
  422 : 'Unprocessable Entity',       // RFC 4918
  423 : 'Locked',                     // RFC 4918
  424 : 'Failed Dependency',          // RFC 4918
  425 : 'Unordered Collection',       // RFC 4918
  426 : 'Upgrade Required',           // RFC 2817
  428 : 'Precondition Required',      // RFC 6585
  429 : 'Too Many Requests',          // RFC 6585
  431 : 'Request Header Fields Too Large',// RFC 6585
  500 : 'Internal Server Error',
  501 : 'Not Implemented',
  502 : 'Bad Gateway',
  503 : 'Service Unavailable',
  504 : 'Gateway Time-out',
  505 : 'HTTP Version not supported',
  506 : 'Variant Also Negotiates',    // RFC 2295
  507 : 'Insufficient Storage',       // RFC 4918
  509 : 'Bandwidth Limit Exceeded',
  510 : 'Not Extended',               // RFC 2774
  511 : 'Network Authentication Required' // RFC 6585
};
