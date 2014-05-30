"use strict";

var util = require('util');
var Stream = require('stream');

var CipherCommon = require('crypto/cipher_common');

var crypto = {};
crypto.Hash     = require('crypto/hash');
crypto.Hmac     = require('crypto/hmac');
crypto.Cipher   = require('crypto/cipher');
crypto.Decipher = require('crypto/decipher');
crypto.Sign     = require('crypto/sign');
crypto.Verify   = require('crypto/verify');

var PBKDF2 = require('crypto/pbkdf2');
var Random = require('crypto/random');


// ----------------------------------------
// crypto
// ----------------------------------------

crypto.getCiphers = function() {
  return CipherCommon.CipherTypes.types();
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

crypto.createCipher   = crypto.Cipher.createCipher;
crypto.createCipheriv = crypto.Cipher.createCipheriv;

crypto.createDecipher   = crypto.Decipher.createDecipher;
crypto.createDecipheriv = crypto.Decipher.createDecipheriv;

crypto.createSign = function(algorithm) {
  return new crypto.Sign(algorithm);
};

crypto.createVerify = function(algorithm) {
  return new crypto.Verify(algorithm);
};

crypto.createDiffieHellman = function(/* (prime_length) or (prime,enc) */) {
};

crypto.getDiffieHellman = function(group_name) {
};

crypto.pbkdf2     = PBKDF2.pbkdf2;
crypto.pbkdf2Sync = PBKDF2.pbkdf2Sync;

crypto.randomBytes       = Random.randomBytes;
crypto.pseudoRandomBytes = Random.pseudoRandomBytes;

crypto.DEFAULT_ENCODING = 'buffer';

// ----------------------------------------
// DiffieHellman
// ----------------------------------------

/*
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