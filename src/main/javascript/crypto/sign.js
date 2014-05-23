"use strict";

var SignCommon = require('crypto/sign_common');

var util = require('util');
var Stream = require('stream');
var Buffer = require('buffer').Buffer;

var Helper = org.projectodd.nodyn.buffer.Helper;
var Signature = java.security.Signature;

var SignerBuilder                   = org.bouncycastle.operator.jcajce.JcaContentSignerBuilder;
var Generator                       = org.bouncycastle.cms.CMSSignedDataGenerator;
var SignerInfoGeneratorBuilder      = org.bouncycastle.cms.jcajce.JcaSignerInfoGeneratorBuilder
var DigestCalculatorProviderBuilder = org.bouncycastle.operator.jcajce.JcaDigestCalculatorProviderBuilder
var TypedData                       = org.bouncycastle.cms.CMSProcessableByteArray;

var Sign = function(algorithm) {
  if (!(this instanceof Sign)) return new Sign(algorithm);

  Stream.Writable.call( this, {} );

  this.algorithm = algorithm;
  this._algorithm = SignCommon.SignatureTypes.get( algorithm );
  this._buffer= new org.vertx.java.core.buffer.Buffer();

  return this;
};

util.inherits(Sign, Stream.Writable);

Sign.prototype.update = function(data) {
  this.write( data );
};

Sign.prototype.sign = function(private_key, output_format) {
  var signKey = SignCommon.createKeyFromString( private_key );
  var gen     = new Generator();
  var signer  = new SignerBuilder( this._algorithm.algorithm ).build( signKey.private );

  var digest     =  new DigestCalculatorProviderBuilder().build();
  var signerInfo =  new SignerInfoGeneratorBuilder( digest ).build(signer, [ 0 ] );

  gen.addSignerInfoGenerator( signerInfo );

  var msg = new TypedData( this._buffer.bytes );

  var sigData = gen.generate(msg);
  var sigBytes = sigData.encoded;

  return new Buffer( sigBytes );
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