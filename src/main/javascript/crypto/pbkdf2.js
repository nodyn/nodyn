
var Buffer           = require('buffer').Buffer;
var Helper           = org.projectodd.nodyn.buffer.Helper;
var SecretKeyFactory = javax.crypto.SecretKeyFactory;
var PBEKeySpec       = javax.crypto.spec.PBEKeySpec;
var SecretKeySpec    = javax.crypto.spec.SecretKeySpec;

function pbkdf2Sync(password, salt, iterations, keylen) {
  var factory = SecretKeyFactory.getInstance("PBKDF2WithHmacSHA1");
  var keySpec = new PBEKeySpec( Helper.characters(password), Helper.bytes(salt, 'utf8'), iterations, keylen * 8 );
  var secretKey = factory.generateSecret(keySpec);
  var encoded = secretKey.encoded;
  var keyBuf = new Buffer( encoded );
  return keyBuf;
}

module.exports = {
  pbkdf2Sync: pbkdf2Sync,
}