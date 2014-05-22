"use strict";

var util = require('util');
var Stream = require('stream');

var CipherCommon = require('crypto/cipher_common');

var Helper = org.projectodd.nodyn.buffer.Helper;
var Buffer = require('buffer').Buffer;

var Signature = java.security.Signature;

var crypto = {};
crypto.Hash     = require('crypto/hash');
crypto.Hmac     = require('crypto/hmac');
crypto.Cipher   = require('crypto/cipher');
crypto.Decipher = require('crypto/decipher');

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
  return new crypto.Hash(algorithm);
};

crypto.createHmac = function(algorithm,key) {
  return new crypto.Hmac(algorithm,key);
};

crypto.createCipher = function(algorithm,password) {
  return new crypto.Cipher(algorithm,password);
};

crypto.createCipheriv = function(algorithm,password,iv) {
};

crypto.createDecipher = function(algorithm,password) {
  return crypto.Decipher(algorithm,password);
};

crypto.createDecipheriv = function(algorithm,password,iv) {
};

crypto.createSign = function(algorithm) {
  return new Sign(algorithm);
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
// Sign
// ----------------------------------------

var SignatureTypes = {};

SignatureTypes.get = function(algo) {
  algo = algo.toLowerCase();

  if ( algo == 'rsa-sha256' ) {
    return SignatureTypes.SHA256withRSA;
  }
}

SignatureTypes.SHA256withRSA = {
  algorithm: 'SHA256withRSA',
};

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

// ----------------------------------------
// Verify
// ----------------------------------------

/*
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