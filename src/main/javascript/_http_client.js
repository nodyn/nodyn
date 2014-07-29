var http = require('http');
var url   = NativeRequire.require('url');
var net   = NativeRequire.require('net');
var util  = NativeRequire.require('util');
var nodyn = NativeRequire.require('nodyn');
var Stream = NativeRequire.require('stream');
var MultiMap = NativeRequire.require('nodyn/multiMap');
var EventEmitter = require('events').EventEmitter;
var IncomingMessage = require('_http_incoming').IncomingMessage;


function ClientRequest(options, callback) {
  Stream.Writable.call( this );
  this._request = new io.nodyn.http.client.ClientRequestWrap( http.globalAgent._agent, options.method, options.host, options.port, options.path );

  this._request.on( "response", this._onResponse.bind(this) );
  this._request.on( "socket",   this._onSocket.bind(this) );
  this._request.on( "connect",  this._onConnect.bind(this) )
  this._request.on( "upgrade",  this._onUpgrade.bind(this) )
  this._request.on( 'continue', this._onContinue.bind(this) );

  if ( callback ) {
    this.on( "response", callback );
  }
}

util.inherits(ClientRequest, Stream.Writable);

ClientRequest.prototype._onSocket = function(result) {
  this.socket  = new net.Socket( { socket: result.result } );
  this.socket.on( "timeout", function() {
    this.emit( "timeout" );
  }.bind(this));
  if ( this._timeout ) {
    this.socket.setTimeout( this._timeout );
  }
  this.emit( "socket", this.socket );
};

ClientRequest.prototype._onResponse = function(result) {
  if ( this.listeners('response').length == 0 ) {
    this.on( 'response', function(resp) {
      resp.on('data', function(d) {
        // discard
      });
      resp.on('end', function(d) {
        resp.socket.end();
      });
    });
  }
  this.emit( "response", new IncomingMessage( result.result ) );
};

ClientRequest.prototype._onContinue = function(result) {
  this.emit( 'continue' );
};

ClientRequest.prototype._onConnect = function(result) {
  if ( this.listeners('connect').length == 0 ) {
    this.abort();
  }
  var incomingMessage = new IncomingMessage(result.result);
  this.emit( 'connect', incomingMessage, incomingMessage.socket );
}

ClientRequest.prototype._onUpgrade = function(result) {
  if ( this.listeners('upgrade').length == 0 ) {
    this.abort();
  }
  var incomingMessage = new IncomingMessage(result.result);
  this.emit( 'upgrade', incomingMessage, incomingMessage.socket );
}

ClientRequest.prototype._write = function(chunk, encoding, callback) {
  if ( chunk instanceof Buffer ) {
    this._request.write( chunk._nettyBuffer() );
  }
  callback();
};

ClientRequest.prototype.end = function(chunk) {
  if ( chunk ) {
    this.write( chunk );
  }

  this._request.end();
};

ClientRequest.prototype.abort = function(b) {
  this._request.abort();
};

ClientRequest.prototype.getHeader = function(name) {
  return this._request.headers.get(name);
};

ClientRequest.prototype.setHeader = function(name, value) {
  this._request.headers.set(name, value.toString());
};

ClientRequest.prototype.removeHeader = function(name) {
  this._request.headers.remove(name);
};

ClientRequest.prototype.addTrailers = function(trailers) {
  for ( t in trailers ) {
    this._request.trailers.set( t, trailers[t] );
  }
}

ClientRequest.prototype.setTimeout = function(msec, timeout) {
  if ( this.socket ) {
    this.socket.setTimeout( msec );
  } else {
    this._timeout = msec;
  }
  if ( timeout ) {
    this.on( "timeout", timeout );
  }
  //if (timeout ) {
    //this.socket.setTimeout( msec, function() {
      //this.emit( "timeout" );
    //}.bind(this) );
    //this.once( "timeout", timeout );
  //}
};

module.exports.ClientRequest = ClientRequest;

var DefaultRequestOptions = {
  host:     'localhost',
  method:   'GET',
  path:     '/',
  port:     80,
  agent:    http.globalAgent,
};

module.exports.request = function(options, callback) {
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
  options.port     = options.port     || DefaultRequestOptions.port;
  options.method   = options.method   || DefaultRequestOptions.method;
  options.path     = options.path     || DefaultRequestOptions.path;
  options.headers  = options.headers  || {};
  options.agent    = options.agent    || DefaultRequestOptions.agent;

  //var agent = new io.nodyn.http.client.AgentWrap( process.EVENT_LOOP );

 // return agent.request( options.method, options.host || options.hostname, options.port, options.path );
  //var request = new ClientRequest( agent.request( options.method, options.host || options.hostname, options.port, options.path ), callback );
  var request = new ClientRequest( options, callback );
  for ( h in options.headers ) {
    request.setHeader( h, options.headers[h] );
  }
  return request;
};

module.exports.get = function(options, callback) {
  var request  = module.exports.request( options, callback );
  request.end();
  return request;
}

module.exports.createClient = function() {
  // This is deprecated. Use http.request instead
  console.log("http.createClient is deprecated. Please use http.request instead");
};
