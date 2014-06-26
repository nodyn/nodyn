var url   = NativeRequire.require('url');
var net   = NativeRequire.require('net');
var util  = NativeRequire.require('util');
var nodyn = NativeRequire.require('nodyn');
var Stream = NativeRequire.require('stream');
var MultiMap = NativeRequire.require('nodyn/multiMap');
var EventEmitter = require('events').EventEmitter;
var IncomingMessage = require('_http_incoming').IncomingMessage;


function ClientRequest(proxy) {
  this.proxy = proxy;
  this.timeoutId       = undefined;
  this.timeoutMsec     = undefined;
  this.timeoutCallback = undefined;
  // TODO: These methods are not available on a
  // vert.x HttpClientRequest...
  this.setNoDelay = function() {};
  this.setSocketKeepAlive = function() {};
}

ClientRequest.prototype.write = function(chunk, encoding) {
  encoding = encoding || 'UTF-8';
  this.proxy.write(chunk, encoding);
};

ClientRequest.prototype.end = function(b) {
  if (b) {
    this.proxy.end(b);
  } else {
    this.proxy.end();
  }
};

ClientRequest.prototype.abort = function(b) {
  this.proxy.end();
};

ClientRequest.prototype.setTimeout = function(msec, callback) {
  if ( this.msec == 0 ) {
    this.timeoutCallback = undefined;
  } else {
    this.proxy.setTimeout( msec );
    this.timeoutCallback = callback;
  }
};

ClientRequest.prototype.handleException = function(e) {
  if ( ( e instanceof java.util.concurrent.TimeoutException ) && this.timeoutCallback ) {
    this.timeoutCallback();
  }
}

nodyn.makeEventEmitter(ClientRequest);
module.exports.ClientRequest = ClientRequest;

var DefaultRequestOptions = {
  host:     'localhost',
  hostname: 'localhost',
  method:   'GET',
  path:     '/',
  port:     80
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

  var proxy = process.context.createHttpClient()
                    .setPort(options.port)
                    .setHost(options.hostname);

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
    }
    if (callback) {
      clientRequest.on('response', callback);
      clientRequest.emit('response', incomingMessage);
    }
  });

  clientRequest = new ClientRequest(request);

  request.exceptionHandler( clientRequest.handleException.bind(clientRequest) );

  if (options.method === 'HEAD' || options.method === 'CONNECT') {
    request.setChunked(false);
  } else {
    request.setChunked(true);
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
