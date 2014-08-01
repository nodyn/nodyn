
function HTTPParser() {
  this._parser = new io.nodyn.http.HTTPParser();
  this._parser.on( 'headersComplete', HTTPParser.prototype._onHeadersComplete.bind(this) );
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

  return this[HTTPParser.kOnHeadersComplete].call( this, this );
}

// ----------------------------------------
// ----------------------------------------

HTTPParser.prototype.reinitialize = function(type) {
  delete this.method;
  delete this.url;
  delete this.versionMajor;
  delete this.versionMinor;
  delete this.headers;
  delete this.shouldKeepAlive;
  this._parser.reinitialize();
}

HTTPParser.prototype.execute = function(d) {
  return this._parser.execute( d._buffer.byteBuf );
}

HTTPParser.kOnHeaders = 0;
HTTPParser.kOnHeadersComplete = 1;
HTTPParser.kOnBody = 2;
HTTPParser.kOnMessageComplete = 3;

HTTPParser.REQUEST = {};
HTTPParser.methods = io.nodyn.http.HTTPParser.METHODS;

module.exports.HTTPParser = HTTPParser;