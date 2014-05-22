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
  return new crypto.Sign(algorithm);
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