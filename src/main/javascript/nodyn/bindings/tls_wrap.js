
function SSL(handle, context, isServer) {
  this._ssl = new io.nodyn.tls.SSLWrap( process._process );

  this._ssl.on( "handshakestart", _onhandshakestart.bind(this) );
  this._ssl.on( "handshakedone",  _onhandshakedone.bind(this) );
  this._ssl.on( "newsession",     _onnewsession.bind(this) );

  this._ssl.init( handle._stream, context._context, isServer );
  handle._stream.on( 'data', SSL.prototype._onData.bind(this) );

  this.handle = handle;
  this.context = context;
  this.isServer = isServer;
}

function _onhandshakestart(result) {
  this.onhandshakestart();
}

function _onhandshakedone(result) {
  this._handshakedone = true;
  this.onhandshakedone();
}

function _onnewsession(result) {
  var sessionId   = result.result[0];
  var sessionData = result.result[1];

  this.onnewsession( sessionId, sessionData );
}

SSL.prototype._onData = function(result) {
  if ( this._handshakedone ) {
    var nread = result.result.readableBytes();
    var b = process.binding('buffer').createBuffer( result.result );
    this.handle.onread( nread, b );
  } else {
    this._ssl.receive( result.result );
  }
}

SSL.prototype.receive = function(buf) {
  this._ssl.receive( buf._nettyBuffer() );
}

SSL.prototype.setVerifyMode = function(requestCert, rejectUnauthorized) {
}

SSL.prototype.getNegotiatedProtocol = function() {
  return this._ssl.negotiatedProtocol;
}

SSL.prototype.getServername = function() {
  return this._ssl.servername;
}

SSL.prototype.requestOCSP = function() {
}

SSL.prototype.start = function() {
  this._ssl.start();
}

SSL.prototype.verifyError = function() {
}

SSL.prototype.getPeerCertificate = function(detailed) {
  return new Certificate( this._ssl.getPeerCertificate() );
}

function Certificate(cert) {
  this._cert = cert;
  this.subject = cert.getSubjectX500Principal().getName( 'CANONICAL' );
  this.issuer  = cert.getIssuerX500Principal().getName( 'CANONICAL' );

  this.subjectaltnames = [];

  var names = cert.subjectAlternativeNames;
  if ( names ) {
    var iter1 = names.iterator();
    while ( iter1.hasNext() ) {
      var iter2 = iter1.next().iterator();
      while ( iter2.hasNext() ) {
        this.subjectaltnames.push( iter2.next() );
      }
    }
  }

  this.subjectaltnames = this.subjectaltnames.join( ', ');
}

function wrap(handle, context, isServer) {
  return new SSL(handle, context, isServer);
}

module.exports.wrap = wrap;
