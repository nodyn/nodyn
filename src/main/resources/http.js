var url  = require('url');
var util = require('util');
var EventEmitter = require('events').EventEmitter

var WebServer = module.exports.Server = function(requestListener) {
  var that   = this;
  that.proxy = vertx.createHttpServer();

  // default socket timeout value (2 minutes)
  that.timeout = 120000;
  that.timeoutId = null;

  // default limit for incoming headers
  // TODO: Actually implement limits
  that.maxHeadersCount = 1000;

  if (requestListener) {
    that.on('request', requestListener);
  }

  that.close = function(callback) {
    if (callback) { that.on('close', callback); }
    that.proxy.close(function() { 
      that.emit('close'); 
    });
  }

  // port, [hostname], [callback]
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
    that.proxy.requestHandler( function(request) {
      var incomingMessage = new IncomingMessage(request);
      var serverResponse  = new ServerResponse(request.response);

      if (request.method == 'CONNECT') {
        if (that.listeners('connect').length > 0) {
          // TODO: Node.js expects socket+head as addtl params on this
          that.emit('connect', incomingMessage); 
        } else {
          // close the connection per the node.js api
          serverResponse.emit('close');
          serverResponse.end();
          request.response.close();
          return;
        }
      }
      if (request.headers()['Expect'] == '100-Continue') {
        if (that.listeners('checkContinue').length > 0) {
          // if a client has subscribed to checkContinue events
          // we let it handle the message
          that.emit('checkContinue', incomingMessage, serverResponse);
        } else {
          // otherwise, the server sends a continue message
          // TODO: vert.x automatically does this - but will
          // be changing to accept a checkContinue handler.
        }
      } else {
        that.emit('request', incomingMessage, serverResponse);
      }

      // handle incoming data
      request.dataHandler(function(buffer) {
        incomingMessage.emit('data', buffer);
      });

      request.endHandler(function() {
        incomingMessage.emit('end');
      });
    });

    // listen for incoming connections
    that.proxy.listen(port, host, function() {
      that.emit('listening');
    });
  }

  that.setTimeout = function(msec, callback) {
    if (that.timeoutId) { 
      vertx.cancelTimer(that.timeoutId);
      that.removeAllListeners('timeout');
    }
    that.on('timeout', function() {
      callback(that);
    });
    that.timeoutId = vertx.setTimer(msec, function() {
      that.emit('timeout');
    });
  }

  that.setTimeout(that.timeout, function() {
    that.close();
  });
}

// Node.js uses IncomingMessage for both the server and the client
// That makes this class a little bulky as we check the type
// and set properties accordingly
var IncomingMessage = module.exports.IncomingMessage = function(vertxRequest) {
  var that  = this;
  var proxy = vertxRequest;

  that.encoding = 'UTF-8';
  that.headers = proxy.headers();
  that.pause  = proxy.pause.bind(proxy);
  that.resume = proxy.resume.bind(proxy);

  that.setEncoding = function(enc) {
    try {
      that.encoding = java.nio.charset.Charset.forName(enc).toString();
    } catch(err) {
      console.error("Cannot find message encoding for: " + enc);
      console.error(err);
    }
  }

  proxy.dataHandler(function(buffer) {
    that.emit('data', buffer.toString(that.encoding));
  });
  proxy.endHandler(function() {
    if (proxy.trailers) {
      // make sure we have all the trailers from the response object
      that.trailers = proxy.trailers();
    }
    that.emit('end');
  });

  if (proxy.getNettyRequest) {
    // It's a server request message
    // vert.x HttpServerRequest
    var version = proxy.getNettyRequest().getProtocolVersion();
    that.httpMajorVersion = version.majorVersion().toString();
    that.httpMinorVersion = version.minorVersion().toString();
    that.httpVersion = that.httpMajorVersion + "." + that.httpMinorVersion;
    that.url = proxy.uri;
    that.method = proxy.method;
    that.headersSent = that.headers.size() > 0;
  } else {
    // it's a client response message
    // vert.x HttpClientResponse
    that.statusCode = proxy.statusCode;
  }
}

var ServerResponse = module.exports.ServerResponse = function(vertxResponse) {
  var that         = this;
  var proxy        = vertxResponse;
  that.sendDate    = true;
  that.headersSent = false;
  that.end         = proxy.end.bind(proxy);

  // node.js defaults to HTTP chunked encoding, whereas vert.x defaults
  // to non-chunked. Inform vert.x we want chunked for now.
  proxy.setChunked(true);
  
  that.writeHead = function() {
    if (!that.headersSent) {
      reasonPhrase = null;
      statusCode   = arguments[0];
      headers      = {};

      if (typeof arguments[1]  == 'string') {
        reasonPhrase = arguments[1];
        if (arguments[2]) {
          headers = arguments[2];
        }
      } else if (typeof arguments[1]  == 'object') {
        headers = arguments[1];
      }
      for( header in headers ) {
        that.setHeader(header, headers[header]);
      }
      if (statusCode) {
        proxy.statusCode = statusCode;
      }
      if (reasonPhrase) {
        proxy.statusMessage = reasonPhrase;
      }
      // default HTTP date header
      if (!proxy.headers()['Date']) {
        that.setHeader('Date', new Date().toUTCString());
      }
      if (that.getHeader('Content-Length')) {
        proxy.setChunked(false);
      }
      that.headersSent = true;
    }
  }

  // response.write(chunk, [encoding])
  that.write = function() {
    var length = 0;
    var chunk  = arguments[0];
    var encode = "UTF-8";
    if (!that.headersSent) {
      that.writeHead();
    }
    if (typeof arguments[1] == 'string') {
      encode = arguments[1];
    }
    proxy.write(chunk, encode);
  }

  that.getHeader = function(name) {
    return proxy.headers()[name];
  }

  that.setHeader = function(name, value) {
    proxy.putHeader(name, value);
  }

  that.removeHeader = function(name) {
    proxy.headers().remove(name);
  }

  that.addTrailers = function(trailers) {
    for( header in trailers ) {
      proxy.putTrailer(header, trailers[header]);
    }
  }

  that.writeContinue = function() {
    that.setHeader('Status', '100 (Continue)');
    that.writeHead();
  }
}

var ClientRequest = module.exports.ClientRequest = function(vertxRequest) {
  var that      = this;
  var proxy     = vertxRequest;
  var timeoutId = null;

  that.end   = proxy.end.bind(proxy);
  that.write = proxy.write.bind(proxy);
  that.abort = that.end; // not really a true abort

  proxy.setChunked(true); // TODO: This should be configurable?

  that.setTimeout = function(msec, timeout) { 
    if (timeoutId) {
      vertx.cancelTimer(timeoutId);
    }
    if (msec > 0) {
      if (timeout) {
        that.on('timeout', timeout);
      }
      timeoutId = vertx.setTimer(msec, function() { that.emit('timeout'); });
    }
  }

  // TODO: These methods are not available on a 
  // vert.x HttpClientRequest...
  that.setNoDelay = function() {}
  that.setSocketKeepAlive = function() {}
}

var DefaultRequestOptions = {
  host:     'localhost',
  hostname: 'localhost',
  method:   'GET',
  path:     '/',
  port:     80
}

// Make the web server and its ilk emit events
util.inherits(WebServer, EventEmitter);
util.inherits(ServerResponse, EventEmitter);
util.inherits(IncomingMessage, EventEmitter);
util.inherits(ClientRequest, EventEmitter);

module.exports.createServer = function(requestListener) {
  return new WebServer(requestListener);
}

module.exports.get = function(options, callback) {
  options.method = 'GET';
  var clientRequest = httpRequest(options, callback);
  clientRequest.end();
  return clientRequest;
}

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

  var proxy = vertx.createHttpClient()
                    .setPort(options.port)
                    .setHost(options.hostname);

  var request = proxy.request(options.method, options.path, function(resp) { 
    incomingMessage = new IncomingMessage(resp);
    callback(incomingMessage);
  });
  if (options.headers) {
    for (header in options.headers) {
      request.putHeader(header, options.headers[header]);
    }
  }
  return new ClientRequest(request);
}

module.exports.createClient = function() {
  // This is deprecated. Use http.request instead
  console.log("http.createClient is deprecated. Please use http.request instead");
}

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


