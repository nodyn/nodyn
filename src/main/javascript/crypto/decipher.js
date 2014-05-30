
var util = require('util');
var Buffer = require('buffer').Buffer;
var Stream = require('stream');
var CipherCommon = require('crypto/cipher_common');

var SecretKeySpec = javax.crypto.spec.SecretKeySpec;
var IvParameterSpec = javax.crypto.spec.IvParameterSpec;

var Helper = org.projectodd.nodyn.buffer.Helper;

var jCipher = javax.crypto.Cipher;

var Decipher = function(algorithm, key, iv) {
  if (!(this instanceof Decipher)) return new Decipher(algorithm, key, iv);

  Stream.Duplex.call( this, {} );

  this.algorithm = algorithm;

  var cipherType = CipherCommon.CipherTypes.get( algorithm );
  this._cipher = jCipher.getInstance( cipherType.cipher );

  this._cipher.init( jCipher.DECRYPT_MODE, key, iv );

  return this;
};

util.inherits(Decipher, Stream.Duplex);

Decipher.prototype.update = function(data, input_enc, output_enc) {
  this.write(data, input_enc);
};

Decipher.prototype.final = function(output_enc) {
  var bytes = this._cipher.doFinal();
  var buf = new Buffer( bytes );
  return buf;
};

Decipher.prototype.setAutoPadding = function(auto_padding) {
  if ( ! auto_padding ) {
    auto_padding = true;
  }

  this.auto_padding = auto_padding;
}

Decipher.prototype._write = function(chunk, enc, callback) {
  if ( chunk instanceof Buffer ) {
    this._cipher.update( chunk.delegate.bytes );
  } else {
    this._cipher.update(Helper.bytes( chunk, Buffer.encodingToJava( enc ) ) );
  }
  callback();
}

Decipher.createDecipher = function(algorithm, password) {
  var cipherType = CipherCommon.CipherTypes.get( algorithm );
  var kiv = CipherCommon.createKeyAndIv( cipherType, password);

  return new Decipher(algorithm, kiv.key, kiv.iv );
}

Decipher.createDecipheriv = function(algorithm,key,iv) {
  var cipherType = CipherCommon.CipherTypes.get( algorithm );
  var keySpec = new SecretKeySpec( new Buffer( key ).delegate.bytes, cipherType.algorithm );
  var ivSpec = new IvParameterSpec( new Buffer( iv ).delegate.bytes );

  return new Decipher(algorithm, keySpec, ivSpec);
}
module.exports = Decipher;
