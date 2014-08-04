
function HTTPParser() {
  this._parser = new io.nodyn.http.HTTPParser();
  this._parser.on( 'headersComplete', HTTPParser.prototype._onHeadersComplete.bind(this) );
  this._parser.on( 'body',            HTTPParser.prototype._onBody.bind(this) );
  this._parser.on( 'messageComplete', HTTPParser.prototype._onMessageComplete.bind(this) );
}

// ----------------------------------------

HTTPParser.prototype._onHeadersComplete = function(result) {

  this.method          = this._parser.method;
  this.url             = this._parser.url;
  this.versionMajor    = this._parser.versionMajor;
  this.versionMinor    = this._parser.versionMinor;
  this.shouldKeepAlive = this._parser.shouldKeepAlive;

  // headers
  this.headers = [];

  var headersMap = this._parser.headers;
  var keyIter = headersMap.keySet().iterator();
  while ( keyIter.hasNext() ) {
    var key   = keyIter.next();
    var value = headersMap[key];
    this.headers.push( key );
    this.headers.push( value );
  }

  return this[HTTPParser.kOnHeadersComplete].call(this, this);
}

HTTPParser.prototype._onBody = function(result) {
  var buffer = new Buffer( result.result );
  return this[HTTPParser.kOnBody].call(this, buffer, 0, buffer.length);
}

HTTPParser.prototype._onMessageComplete = function(result) {
  this[HTTPParser.kOnMessageComplete].call(this);
}

// ----------------------------------------
// ----------------------------------------

HTTPParser.prototype.reinitialize = function(state) {
  delete this.method;
  delete this.url;
  delete this.versionMajor;
  delete this.versionMinor;
  delete this.headers;
  delete this.shouldKeepAlive;
  this._parser.reinitialize( state );
}

HTTPParser.prototype.execute = function(d) {
  return this._parser.execute( d._buffer.byteBuf );
}

HTTPParser.prototype.finish = function() {
  this._parser.finish();
}

HTTPParser.kOnHeaders = 0;
HTTPParser.kOnHeadersComplete = 1;
HTTPParser.kOnBody = 2;
HTTPParser.kOnMessageComplete = 3;

HTTPParser.REQUEST  = io.nodyn.http.HTTPParser.REQUEST;
HTTPParser.RESPONSE = io.nodyn.http.HTTPParser.RESPONSE;

HTTPParser.methods  = io.nodyn.http.HTTPParser.METHODS;

module.exports.HTTPParser = HTTPParser;