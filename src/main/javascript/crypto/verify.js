"use strict";

var SignCommon = require('crypto/sign_common');

var util = require('util');
var Stream = require('stream');
var Buffer = require('buffer').Buffer;

//var SignerBuilder                   = org.bouncycastle.operator.jcajce.JcaContentSignerBuilder;
//var Generator                       = org.bouncycastle.cms.CMSSignedDataGenerator;
//var SignerInfoGeneratorBuilder      = org.bouncycastle.cms.jcajce.JcaSignerInfoGeneratorBuilder
//var DigestCalculatorProviderBuilder = org.bouncycastle.operator.jcajce.JcaDigestCalculatorProviderBuilder
var TypedData                       = org.bouncycastle.cms.CMSProcessableByteArray;
var SignedData                      = org.bouncycastle.cms.CMSSignedData;
var Base64                          = org.bouncycastle.util.encoders.Base64;

var SignerVerifierBuilder           = org.bouncycastle.cms.jcajce.JcaSimpleSignerInfoVerifierBuilder;

var Verify = function(algorithm) {
  if (!(this instanceof Verify)) return new Verify(algorithm);

  Stream.Writable.call( this, {} );

  this.algorithm = algorithm;
  this._algorithm = SignCommon.SignatureTypes.get( algorithm );
  this._buffer= new org.vertx.java.core.buffer.Buffer();

  return this;
};

util.inherits(Verify, Stream.Writable);

Verify.prototype.update = function(data) {
  this.write( data );
};

Verify.prototype.verify = function(object, signature, signature_format) {
  var sigBytes;
  if ( signature_format == 'base64' ) {
    sigBytes = Base64.decode( signature );
  } else if ( signature instanceof Buffer ) {
    sigBytes = signature.delegate.bytes;
  }

  var pubKey = SignCommon.createKeyFromString( object );

  var content = new TypedData( this._buffer.bytes );

  try {
    var sigData = new SignedData( content, sigBytes );
    var signerInfos = sigData.signerInfos;
    var iter = signerInfos.signers.iterator();

    var verifier = new SignerVerifierBuilder().build( pubKey.public );
    while ( iter.hasNext() ) {
      var signer = iter.next();
      if ( signer.verify( verifier ) ) {
        return true;
      }
    }
  } catch(err) {
    return false;
  }

  return false;
};

Verify.prototype._write = function(chunk, enc, callback) {
  if ( chunk instanceof Buffer ) {
    this._buffer.appendBuffer( chunk.delegate)
  } else {
    this._buffer.appendBytes(Helper.bytes( chunk, Buffer.encodingToJava( enc ) ) );
  }
  callback();
}

module.exports = Verify;