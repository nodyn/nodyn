var util  = NativeRequire.require('util');
var nodyn = NativeRequire.require('nodyn');
var Stream = NativeRequire.require('stream');
var MultiMap = NativeRequire.require('nodyn/multiMap');
var EventEmitter = require('events').EventEmitter;
var IncomingMessage = require('_http_incoming').IncomingMessage;
var Buffer = require("buffer").Buffer;

function Server(requestListener) {
  this.proxy = process.context.createHttpServer();

  // default limit for incoming headers
  // TODO: Actually implement limits
  this.maxHeadersCount = 1000;
  // default socket timeout value (2 minutes)
  this.timeout   = 120000;
  this.timeoutId = null;

  if (requestListener) {
    this.on('request', requestListener);
  }

}

Server.prototype.close = function(callback) {
  if (callback) {
    this.once('close', callback);
  }
  this.proxy.close(function() {
    process.nextTick(this.emit.bind(this, 'close'));
  }.bind(this));
};

Server.prototype.listen = function(port /*, hostname, callback */) {
  var args = Array.prototype.slice.call(arguments, 1);
  var last = args.pop();
  var host = '0.0.0.0';

  switch(typeof last) {
    case 'function':
      // activate the 'listening' callback
      this.on('listening', last);
      host = args.pop() || host;
      break;
    case 'string':
      host = last;
      break;
  }

  // setup a connection handler in vert.x
  this.proxy.requestHandler( function(request) {
    // request is a vert.x HttpServerRequest
    if (request.method() !== 'HEAD') {
      request.response().setChunked(true);
    }
    var incomingMessage = new IncomingMessage(request);
    var serverResponse  = new ServerResponse(request.response());
    var headers = new MultiMap(request.headers());

    if (headers.get('Connection') === 'Upgrade') {
      handleUpgrade(this, incomingMessage);
    } else if (headers.get('Expect') == '100-Continue') {
      if (this.listeners('checkContinue').length > 0) {
        this.emit('checkContinue', incomingMessage, serverResponse);
      }
    } else if (request.method() === 'CONNECT') {
      handleConnect(this, incomingMessage, serverResponse);
    } else {
      this.emit('request', incomingMessage, serverResponse);
    }

    // handle incoming data
    request.dataHandler( function(buffer) {
      incomingMessage.push( new Buffer( buffer ) );
    })

    request.endHandler(function() {
      incomingMessage.push(null);
    });

    // TODO setup timeout
  }.bind(this));

  // listen for incoming connections
  this.proxy.listen(port, host, function(future) {
    if (future.succeeded()) {
      this.emit('listening');
    } else {
      this.emit('error', new Error(future.cause().message()));
      this.close();
    }
  }.bind(this));
};

nodyn.makeEventEmitter(Server);
module.exports.Server = Server;

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

function ServerResponse(proxy) {
  // Defer getting the socket from proxy until it's first requested.
  Stream.Writable.call(this);
  Object.defineProperty(this, "proxy", {
    value: proxy,
    configurable: true,
    enumerable: false });
  this.sendDate    = true;
  this.headersSent = false;
  this.statusCode  = 200;
}

util.inherits(ServerResponse, Stream.Writable);

ServerResponse.prototype.end = function( data, encoding, callback ) {
  if ( data ) {
    Stream.Writable.prototype.write.call( this, data, encoding, callback );
  }
  if (!this.headersSent) {
    this.writeHead();
  }
  this.proxy.end();
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

  if (!this.headersSent) {
    if (statusCode) {
      this.proxy.setStatusCode(statusCode);
    } else {
      this.proxy.setStatusCode(this.statusCode);
    }
    for( var header in headers ) {
      this.setHeader(header, headers[header]);
    }
    if (reasonPhrase) {
      this.proxy.setStatusMessage(reasonPhrase);
    }
    // default HTTP date header
    if (!this.proxy.headers().get('date')) {
      this.setHeader('date', new Date().toUTCString());
    }
    if (this.getHeader('content-length')) {
      this.proxy.setChunked(false);
    } else {
      this.proxy.setChunked(true);
    }
    this.headersSent = true;
  }
  this.proxy.setChunked(true);
};

ServerResponse.prototype._write = function(chunk, encoding, callback) {
  var length = 0;
  var encode = encoding || "UTF-8";
  if (!this.headersSent) {
    this.writeHead();
  }
  this.proxy.write(chunk.delegate);
  callback();
};

ServerResponse.prototype.getHeader = function(name) {
  return this.proxy.headers().get(name.toLowerCase());
};

ServerResponse.prototype.setHeader = function(name, value) {
  this.proxy.putHeader(name.toLowerCase(), value.toString());
};

ServerResponse.prototype.removeHeader = function(name) {
  this.proxy.headers().remove(name.toLowerCase());
};

ServerResponse.prototype.addTrailers = function(trailers) {
  for( var header in trailers ) {
    this.proxy.putTrailer(header, trailers[header]);
  }
};

ServerResponse.prototype.writeContinue = function() {
  this.setHeader('Status', '100 (Continue)');
  this.writeHead();
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
