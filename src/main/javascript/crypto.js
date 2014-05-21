"use strict";

var util = require('util');
var Stream = require('stream');
var Codec = require('nodyn/codec' );

var Helper = org.projectodd.nodyn.buffer.Helper;
var Buffer = require('buffer').Buffer;

var MessageDigest = java.security.MessageDigest;

var Mac = javax.crypto.Mac;
var SecretKeySpec = javax.crypto.spec.SecretKeySpec;
var IvParameterSpec = javax.crypto.spec.IvParameterSpec;

var SecretKeyFactory = javax.crypto.SecretKeyFactory;

var jCipher = javax.crypto.Cipher;

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
  return new Cipher(algorithm,password);
};

crypto.createCipheriv = function(algorithm,password,iv) {
};

crypto.createDecipher = function(algorithm,password) {
  return new Decipher(algorithm,password);
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


// ----------------------------------------
// Cipher
// ----------------------------------------

var CipherTypes = {};

CipherTypes.get = function(algo) {
  algo = algo.toLowerCase();

  if ( algo == 'des' ) {
    return CipherTypes.DES;
  }

  if ( algo == 'aes-128-cbc' ) {
    return CipherTypes.AES_128_CBC;
  }
}

CipherTypes.DES = {
  key_len: 8,
  iv_len: 8,
  cipher: 'DES/CBC/PKCS5Padding',
  algorithm: 'DES',
};

CipherTypes.AES_128_CBC = {
  key_len: 16,
  iv_len: 16,
  cipher: 'AES/CBC/PKCS5Padding',
  algorithm: 'AES'
};



/*
 * Note: this is *not* necessarily the recommended way to
 * generate key material and initialization-vectors, but
 * it follows the OpenSSL method, as used by Node.js proper,
 * which is slightly weird and non-standard for longer key-lengths,
 * but does end up being compatible with produced cipher-texts from
 * Node.js.
 */
function kdf(data, keyLen, ivLen) {
  var totalLen = keyLen + ivLen;
  var curLen = 0;
  var prev = new Buffer('');
  var iter = 1;

  var kiv = new Buffer(totalLen);
  kiv.fill(0);

  while ( curLen < totalLen ) {
    prev = kdf_d(data, prev, 1 );
    prev.copy( kiv, curLen );
    ++iter;
    curLen += 16;
  }

  var k = kiv.slice( 0, keyLen );
  var i = kiv.slice( keyLen );

  return {
    key: kiv.slice( 0, keyLen ),
    iv:  kiv.slice( keyLen )
  };
}

function kdf_d(data, prev, iter) {
  var d = new Buffer(prev.length + data.length );
  prev.copy( d );
  data.copy( d, prev.length );

  for ( var i = 0 ; i < iter ; ++i ) {
    var digest = new Hash('md5');
    digest.update( d );
    d = digest.digest();
  }
  return d.slice(0,16);
}

function createKeyAndIv(cipherType, password) {
  var kiv

  if ( password instanceof Buffer ) {
    kiv = kdf( password, cipherType.key_len, cipherType.iv_len );
  } else {
    var bytes = Helper.bytes(password, 'utf-8');
    kiv = kdf( new Buffer( bytes ), cipherType.key_len, cipherType.iv_len );
  }

  var key = new SecretKeySpec( kiv.key.delegate.bytes, cipherType.algorithm );
  var iv = new IvParameterSpec( kiv.iv.delegate.bytes );
  return {
    key: key,
    iv: iv,
  }
}

var Cipher = function(algorithm, password) {
  if (!(this instanceof Cipher)) return new Cipher(arguments);

  Stream.Duplex.call( this, {} );

  this.algorithm = algorithm;

  var cipherType = CipherTypes.get( algorithm );
  this._cipher = jCipher.getInstance( cipherType.cipher );

  var kiv = createKeyAndIv( cipherType, password);
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

// ----------------------------------------
// Decipher
// ----------------------------------------

var Decipher = function(algorithm, password) {
  if (!(this instanceof Decipher)) return new Decipher(arguments);

  Stream.Duplex.call( this, {} );

  this.algorithm = algorithm;

  var cipherType = CipherTypes.get( algorithm );
  this._cipher = jCipher.getInstance( cipherType.cipher );

  var kiv = createKeyAndIv( cipherType, password);
  this._cipher.init( jCipher.DECRYPT_MODE, kiv.key, kiv.iv );

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

/*
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