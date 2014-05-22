
var SignCommon = require('crypto/sign_common');

var util = require('util');
var Stream = require('stream');
var Buffer = require('buffer').Buffer;

var Helper = org.projectodd.nodyn.buffer.Helper;
var Signature = java.security.Signature;

var Sign = function(algorithm) {
  if (!(this instanceof Sign)) return new Sign(algorithm);

  Stream.Writable.call( this, {} );

  this.algorithm = algorithm;
  this._algorithm = SignatureTypes.get( algorithm );
  this._buffer= new org.vertx.java.core.buffer.Buffer();

  return this;
};

util.inherits(Sign, Stream.Writable);

Sign.prototype.update = function(data) {
  this.write( data );
};

Sign.prototype.sign = function(private_key, output_format) {
  var signature = Signature.getInstance( this._algorithm.algorithm );
  var keySpec;
  KeyFactory.getInstance( this._algorithm.algorithm ).generatePrivate( keySpec );
  signature.initSign( )
  signature.update( this._buffer.bytes );
  var bytes = signature.sign( );
  return new Buffer(bytes);
};

Sign.prototype._write = function(chunk, enc, callback) {
  if ( chunk instanceof Buffer ) {
    this._buffer.appendBuffer( chunk.delegate)
  } else {
    this._buffer.appendBytes(Helper.bytes( chunk, Buffer.encodingToJava( enc ) ) );
  }
  callback();
}

module.exports = Sign;