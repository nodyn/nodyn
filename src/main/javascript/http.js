var url   = NativeRequire.require('url');
var net   = NativeRequire.require('net');
var util  = NativeRequire.require('util');
var nodyn = NativeRequire.require('nodyn');
var http  = NativeRequire.require('vertx/http');

var EventEmitter = require('events').EventEmitter;

function WebServer(requestListener) {
  this.proxy = http.createHttpServer();

  // default limit for incoming headers
  // TODO: Actually implement limits
  this.maxHeadersCount = 1000;
  // default socket timeout value (2 minutes)
  this.timeout   = 120000;
  this.timeoutId = null;

  if (requestListener) {
    this.on('request', requestListener);
  }

  this.setTimeout(this.timeout, function() {
    this.close();
  }.bind(this));
}

WebServer.prototype.setTimeout = function(msec, callback) {
  if (this.timeoutId) {
    clearTimeout(this.timeoutId);
    this.removeAllListeners('timeout');
  }
  this.on('timeout', function() {
    callback(this);
  }.bind(this));
  this.timeoutId = setTimeout(function() {
    this.emit('timeout');
  }.bind(this), msec);
};

WebServer.prototype.close = function(callback) {
  if (callback) this.once('close', callback);

  this.proxy.close(function() {
    process.nextTick(this.emit.bind(this, 'close'));
  }.bind(this));
};

WebServer.prototype.listen = function(port /*, hostname, callback */) {
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
    if (request.method() !== 'HEAD') {
      request.response.chunked(true);
    }
    var incomingMessage = new IncomingMessage(request);
    var serverResponse  = new ServerResponse(request.response);

    if (request.headers().get('Connection') === 'Upgrade') {
      handleUpgrade(this, incomingMessage);
    }
    else if (request.headers().get('Expect') == '100-Continue') {
      if (this.listeners('checkContinue').length > 0) {
        this.emit('checkContinue', incomingMessage, serverResponse);
      }
    }
    else if (request.method() === 'CONNECT') {
      handleConnect(this, incomingMessage, serverResponse);
    } else {
      this.emit('request', incomingMessage, serverResponse);
    }

    // handle incoming data
    request.dataHandler(function(buffer) {
      incomingMessage.emit('data', buffer);
    });

    request.endHandler(function() {
      incomingMessage.emit('end');
    });
  }.bind(this));

  // listen for incoming connections
  this.proxy._to_java_server().listen(port, host, function(future) {
    if (future.succeeded()) this.emit('listening');
    else {
      this.emit('error', new Error(future.cause().message()));
      this.close();
    }

  }.bind(this));
};

nodyn.makeEventEmitter(WebServer);
module.exports.Server = WebServer;

module.exports.createServer = function(requestListener) {
  return new WebServer(requestListener);
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


function IncomingMessage(proxy) {
  this.encoding    = 'UTF-8';
  this.headers     = {};
  this.trailers    = {};
  this.pause       = function() { proxy.pause(); };
  this.resume      = function() { proxy.resume(); };
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
  proxy.headers().forEach(function (name, value) {
    if (this.headers[name]) {
      this.headers[name] = this.headers[name] + "; " + value;
    } else {
      this.headers[name] = value;
    }
  }.bind(this));

  // when data arrives, emit an event
  proxy.dataHandler(function(buffer) {
    this.emit('data', buffer.toString(this.encoding));
  }.bind(this));

  // when the request/response ends make sure we deal with any
  // trailers that are a part of the message, then emit an end event
  proxy.endHandler(function() {
    if (proxy.trailers) {
      // make sure we have all the trailers from the response object
      proxy.trailers().forEach(function (name, value) {
        if (this.trailers[name]) {
          this.trailers[name] = this.trailers[name] + "; " + value;
        } else {
          this.trailers[name] = value;
        }
      }.bind(this));
    }
    this.emit('end');
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
    if (proxy.version && proxy.version() === "HTTP_1_1") {
      this.httpMajorVersion = 1;
      this.httpMinorVersion = 1;
      this.httpVersion = "1.1";
    } else {
      this.httpMajorVersion = 1;
      this.httpMinorVersion = 0;
      this.httpVersion = "1.0";
    }
  }
}

IncomingMessage.prototype.setEncoding = function(enc) {
  try {
    this.encoding = java.nio.charset.Charset.forName(enc).toString();
  } catch(err) {
    console.error("Cannot find message encoding for: " + enc);
    console.error(err);
  }
};

nodyn.makeEventEmitter(IncomingMessage);
module.exports.IncomingMessage = IncomingMessage;

function ServerResponse(proxy) {
  this.proxy       = proxy;
  this.sendDate    = true;
  this.headersSent = false;
}

ServerResponse.prototype.end = function( /* data, encoding */ ) {
  if (!this.headersSent) {
    this.writeHead();
  }
  this.proxy.end.apply(this.proxy, arguments);
};

ServerResponse.prototype.writeHead = 
function( statusCode /*, reasonPhrase, headers */) {
  var args = Array.prototype.slice.call(arguments, 1),
      reasonPhrase = null,
      headers = {};

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
    this.proxy.statusCode(statusCode);
    for( var header in headers ) {
      this.setHeader(header, headers[header]);
    }
    if (reasonPhrase) {
      this.proxy.statusMessage(reasonPhrase);
    }
    // default HTTP date header
    if (!this.proxy.headers().get('Date')) {
      this.setHeader('Date', new Date().toUTCString());
    }
    if (this.getHeader('Content-Length')) {
      this.proxy.chunked(false);
    }
    this.headersSent = true;
  }
};

ServerResponse.prototype.write = function(chunk, encoding) {
  var length = 0,
      encode = encoding || "UTF-8";
  if (!this.headersSent) this.writeHead(); 
  this.proxy.write(chunk, encode);
};

ServerResponse.prototype.getHeader = function(name) {
  return this.proxy.headers().get(name);
};

ServerResponse.prototype.setHeader = function(name, value) {
  this.proxy.putHeader(name, value.toString());
};

ServerResponse.prototype.removeHeader = function(name) {
  this.proxy.headers().remove(name);
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

function ClientRequest(proxy) {
  this.proxy = proxy;
  this.timeoutId = null;
  // TODO: These methods are not available on a
  // vert.x HttpClientRequest...
  this.setNoDelay = function() {};
  this.setSocketKeepAlive = function() {};
}

ClientRequest.prototype.write = function() {
  this.proxy.write.apply(this.proxy, arguments);
};

ClientRequest.prototype.end = function(b) {
  if (b) this.proxy.end(b);
  else this.proxy.end();
};

ClientRequest.prototype.abort = function(b) {
  this.proxy.end();
};

ClientRequest.prototype.setTimeout = function(msec, timeout) {
  if (this.timeoutId) {
    cancelTimeout(this.timeoutId);
  }
  if (msec > 0) {
    if (timeout) {
      this.on('timeout', timeout);
    }
    this.timeoutId = setTimeout(function() { 
      this.emit('timeout'); 
    }.bind(this), msec);
  }
};

nodyn.makeEventEmitter(ClientRequest);
module.exports.ClientRequest = ClientRequest;

var DefaultRequestOptions = {
  host:     'localhost',
  hostname: 'localhost',
  method:   'GET',
  path:     '/',
  port:     80
};


module.exports.get = function(options, callback) {
  options.method = 'GET';
  var clientRequest = httpRequest(options, callback);
  clientRequest.end();
  return clientRequest;
};

var httpRequest = module.exports.request = function(options, callback) {
  switch(typeof options) {
    case 'undefined':
      options = {};
      break;
    case 'string':
      options = url.parse(options);
      break;
    case 'function':
      callback = options;
      options  = {};
  }

  options.host     = options.host     || DefaultRequestOptions.host;
  options.hostname = options.hostname || DefaultRequestOptions.hostname;
  options.port     = options.port     || DefaultRequestOptions.port;
  options.method   = options.method   || DefaultRequestOptions.method;
  options.path     = options.path     || DefaultRequestOptions.path;

  var proxy = http.createHttpClient()
                    .port(options.port)
                    .host(options.hostname);

  var clientRequest = null; // The node.js representation

  // The vert.x request
  var request = proxy.request(options.method, options.path, function(resp) {
    var incomingMessage = new IncomingMessage(resp);
    // Allow node.js style websockets (i.e. direct socket connection)
    if (resp.headers().get('Connection') === "Upgrade") {
      if (clientRequest.listeners('upgrade').length > 0) {
        clientRequest.emit('upgrade', incomingMessage, incomingMessage.socket, new Buffer());
        clientRequest.emit('socket', incomingMessage.socket); 
      } else {
        // close the connection
        proxy.close();
      }
    }
    else if (options.method === 'CONNECT') {
      clientRequest.emit('connect', incomingMessage, incomingMessage.socket, new Buffer());
    }
    else if (resp.headers().get('Status') === '100 (Continue)') {
      clientRequest.emit('continue');
    } else if (callback) {
      clientRequest.on('response', callback);
      clientRequest.emit('response', incomingMessage);
    }
  });
  clientRequest = new ClientRequest(request);

  if (options.method === 'HEAD' || options.method === 'CONNECT') {
    request.chunked(false);
  } else {
    request.chunked(true);
  }
  if (options.headers) {
    for (var header in options.headers) {
      request.putHeader(header, options.headers[header]);
    }
  }
  return clientRequest;
};

module.exports.createClient = function() {
  // This is deprecated. Use http.request instead
  console.log("http.createClient is deprecated. Please use http.request instead");
};

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


