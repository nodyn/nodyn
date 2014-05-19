"use strict";

var util = require('util');
var Stream = require('stream');
var Codec = require('nodyn/codec' );

var Helper = org.projectodd.nodyn.buffer.Helper;
var Buffer = require('buffer').Buffer;

var MessageDigest = java.security.MessageDigest;

var Mac = javax.crypto.Mac;
var SecretKeySpec = javax.crypto.spec.SecretKeySpec;

var crypto = {};

// ----------------------------------------
// utils
// ----------------------------------------

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


// ----------------------------------------
// crypto
// ----------------------------------------

crypto.getCiphers = function() {
};

crypto.getHashes = function() {
};

crypto.createCredentials = function(details) {
};

crypto.createHash = function(algorithm) {
  return new Hash(algorithm);
};

crypto.createHmac = function(algorithm,key) {
  return new Hmac(algorithm,key);
};

crypto.createCipher = function(algorithm,password) {
};

crypto.createCipheriv = function(algorithm,password,iv) {
};

crypto.createDecipher = function(algorithm,password) {
};

crypto.createDecipheriv = function(algorithm,password,iv) {
};

crypto.createSign = function(algorithm) {
};

crypto.createVerify = function(algorithm) {
};

crypto.createDiffieHellman = function(/* (prime_length) or (prime,enc) */) {
};

crypto.getDiffieHellman = function(group_name) {
};

crypto.pbkdf2 = function(password, salt, iterations, keylen, callback) {
};

crypto.pbkdf2Sync = function(password, salt, iterations, keylen){
};

crypto.randomBytes = function(size, callback) {
};

crypto.pseudoRandomBytes = function(size, callback) {
};

crypto.DEFAULT_ENCODING = 'buffer';

// ----------------------------------------
// Hash
// ----------------------------------------

var Hash = function(algorithm) {
  if (!(this instanceof Hash)) return new Hash(arguments);

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

crypto.Hash = Hash;

// ----------------------------------------
// Hmac
// ----------------------------------------

var Hmac = function(algorithm,key) {
  if (!(this instanceof Hmac)) return new Hmac(arguments);

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

crypto.Hmac = Hmac;

/*
// ----------------------------------------
// Cipher
// ----------------------------------------

var Cipher = function() {
};

Cipher.prototype.update(data, input_enc, output_enc) {
};

Cipher.prototype.final(output_enc) {
};

Cipher.prototype.setAutoPadding(auto_padding) {
  if ( ! auto_padding ) {
    auto_padding = true;
  }

  this.auto_padding = auto_padding;
}

// ----------------------------------------
// Decipher
// ----------------------------------------

var Decipher = function() {
};

Decipher.prototype.update(data, input_enc, output_enc) {
};

Decipher.prototype.final(output_enc) {
};

Decipher.prototype.setAutoPadding(auto_padding) {
  if ( ! auto_padding ) {
    auto_padding = true;
  }

  this.auto_padding = auto_padding;
}

// ----------------------------------------
// Sign
// ----------------------------------------

var Sign = function() {
};

Sign.prototype.update = function(data) {
};

Sign.prototype.sign = function(private_key, output_format) {
};

// ----------------------------------------
// Verify
// ----------------------------------------

var Verify = function() {
};

Verify.prototype.update = function(data) {
};

Verify.prototype.verify = function(object, signature, signature_format) {
};

// ----------------------------------------
// DiffieHellman
// ----------------------------------------

var DiffieHellman = function() {
};

DiffieHellman.prototype.generateKeys(encoding) {
};

DiffieHellman.prototype.computeSecret(other_public_key, input_enc, output_enc) {
};

DiffieHellman.prototype.getPrime(enc) {
};

DiffieHellman.prototype.getGenerator(enc) {
};

DiffieHellman.prototype.getPublicKey(enc) {
};

DiffieHellman.prototype.getPrivateKey(enc) {
};

DiffieHellman.prototype.setPublicKey(enc) {
};

DiffieHellman.prototype.setPrivateKey(enc) {
};
*/

module.exports = crypto;