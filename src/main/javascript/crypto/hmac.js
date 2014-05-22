var util = require('util');

var Stream = require('stream');
var Codec  = require('nodyn/codec');

var Mac = javax.crypto.Mac;
var SecretKeySpec = javax.crypto.spec.SecretKeySpec;
var Helper = org.projectodd.nodyn.buffer.Helper;

function macAlgorithmToJava(algo) {
  algo = algo.toLowerCase();
  if ( algo == 'sha1' || algo == 'sha-1' || algo == 'hmacsha1') {
    return 'HmacSHA1';
  }

  if ( algo == 'sha256' || algo == 'sha-256' || algo == 'hmacsha256' ) {
    return 'HmacSHA256';
  }

  if ( algo == 'sha512' || algo == 'sha-512' || algo == 'hmacsha512' ) {
    return 'HmacSHA512';
  }

  if ( algo == 'md5' || algo == 'md-5' || algo == 'hmacmd5' ) {
    return 'HmacMD5';
  }

  return algo;
}

var Hmac = function(algorithm,key) {
  if (!(this instanceof Hmac)) return new Hmac(algorithm,key);

  Stream.Writable.call( this, {} );

  this.algorithm = algorithm;
  this._hmac = Mac.getInstance( macAlgorithmToJava( algorithm ) );

  var secretKey = new SecretKeySpec(Helper.bytes( key, 'utf-8' ), macAlgorithmToJava( algorithm) );
  this._hmac.init(secretKey);

  return this;
};

util.inherits(Hmac, Stream.Writable);

Hmac.prototype.update = function(data) {
  this.write(data);
};

Hmac.prototype.digest = function(enc) {
  var d = new Buffer( this._hmac.doFinal() );
  if ( enc == 'binary' ) {
  } else if ( enc == 'base64' ) {
    return Codec.Base64.encode(d);
  } else if ( enc == 'hex' ) {
    return Codec.Hex.encode(d);
  } else {
    return d;
  }
};

Hmac.prototype._write = function(chunk, enc, callback) {
  if ( chunk instanceof Buffer ) {
    this._hmac.update( chunk.delegate.bytes );
  } else {
    this._hmac.update(Helper.bytes( chunk, Buffer.encodingToJava( enc ) ) );
  }
  callback();
}

module.exports = Hmac;