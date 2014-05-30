"use strict";

var nodyn            = require('nodyn');
var Buffer           = require('buffer').Buffer;
var Helper           = org.projectodd.nodyn.buffer.Helper;
var SecretKeyFactory = javax.crypto.SecretKeyFactory;
var PBEKeySpec       = javax.crypto.spec.PBEKeySpec;
var SecretKeySpec    = javax.crypto.spec.SecretKeySpec;

var PBKDF2 = {};

function pbkdf2Sync(password, salt, iterations, keylen) {
  var factory = SecretKeyFactory.getInstance("PBKDF2WithHmacSHA1");
  var keySpec = new PBEKeySpec( Helper.characters(password), Helper.bytes(salt, 'utf8'), iterations, keylen * 8 );
  var secretKey = factory.generateSecret(keySpec);
  var encoded = secretKey.encoded;
  var keyBuf = new Buffer( encoded );
  return keyBuf;
}

function pbkdf2(password, salt, iterations, keylen, callback) {
  if ( ! callback ) {
    throw new Error( "no callback provided" );
  }
  nodyn.asyncAction( function() {
    return pbkdf2Sync(password, salt, iterations, keylen);
  }, callback );
}

module.exports = {
  pbkdf2Sync: pbkdf2Sync,
  pbkdf2: pbkdf2,
}


