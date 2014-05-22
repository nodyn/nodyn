
var util = require('util');
var Buffer = require('buffer').Buffer;
var Stream = require('stream');
var CipherCommon = require('crypto/cipher_common');

var Helper = org.projectodd.nodyn.buffer.Helper;

var jCipher = javax.crypto.Cipher;

var Cipher = function(algorithm, password) {
  if (!(this instanceof Cipher)) return new Cipher(algorithm, password);

  Stream.Duplex.call( this, {} );

  this.algorithm = algorithm;

  var cipherType = CipherCommon.CipherTypes.get( algorithm );
  this._cipher = jCipher.getInstance( cipherType.cipher );

  var kiv = CipherCommon.createKeyAndIv( cipherType, password);
  this._cipher.init( jCipher.ENCRYPT_MODE, kiv.key, kiv.iv );

  return this;
};

util.inherits(Cipher, Stream.Duplex);

Cipher.prototype.update = function(data, input_enc, output_enc) {
  this.write( data, input_enc );
};

Cipher.prototype.final = function(output_enc) {
  var bytes = this._cipher.doFinal();
  var buf = new Buffer( bytes );
  return buf;
};

Cipher.prototype.setAutoPadding = function(auto_padding) {
  if ( ! auto_padding ) {
    auto_padding = true;
  }

  this.auto_padding = auto_padding;
}

Cipher.prototype._write = function(chunk, enc, callback) {
  if ( chunk instanceof Buffer ) {
    this._cipher.update( chunk.delegate.bytes );
  } else {
    this._cipher.update(Helper.bytes( chunk, Buffer.encodingToJava( enc ) ) );
  }
  callback();
}

module.exports = Cipher;
