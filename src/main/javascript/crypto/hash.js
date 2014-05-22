var util = require('util');

var Stream = require('stream');
var Codec  = require('nodyn/codec');

var MessageDigest = java.security.MessageDigest;

function hashAlgorithmToJava(algo) {
  algo = algo.toLowerCase();
  if ( algo == 'sha1' || algo == 'sha-1' ) {
    return 'sha-1';
  }

  if ( algo == 'sha256' || algo == 'sha-256' ) {
    return 'sha-256';
  }

  if ( algo == 'sha512' || algo == 'sha-512' ) {
    return 'sha-512';
  }

  return algo;
}

var Hash = function(algorithm) {
  if (!(this instanceof Hash)) return new Hash(algorithm);

  Stream.Writable.call( this, {} );

  this.algorithm = algorithm;
  this._digest = MessageDigest.getInstance( hashAlgorithmToJava( algorithm ) );

  return this;
};

util.inherits(Hash, Stream.Writable);

Hash.prototype.update = function(data, enc) {
  this.write(data,enc);
};

Hash.prototype.digest = function(enc) {
  var d = new Buffer( this._digest.digest() );
  if ( enc == 'binary' ) {
  } else if ( enc == 'base64' ) {
    return Codec.Base64.encode(d);
  } else if ( enc == 'hex' ) {
    return Codec.Hex.encode(d);
  } else {
    return d;
  }
};

Hash.prototype._write = function(chunk, enc, callback) {
  if ( chunk instanceof Buffer ) {
    this._digest.update( chunk.delegate.getBytes() );
  } else {
    this._digest.update(Helper.bytes( chunk, Buffer.encodingToJava( enc ) ) );
  }
  callback();
}

module.exports = Hash;