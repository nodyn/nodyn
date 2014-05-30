
var Helper = org.projectodd.nodyn.buffer.Helper;
var Buffer = require('buffer').Buffer;

var Hash = require('crypto/hash');

var SecretKeySpec = javax.crypto.spec.SecretKeySpec;
var IvParameterSpec = javax.crypto.spec.IvParameterSpec;

var CipherTypes = {};

CipherTypes._map = {};
CipherTypes._types = [];

CipherTypes.get = function(algo) {
  algo = algo.toLowerCase();
  return CipherTypes._map[ algo ];
}

CipherTypes.types = function() {
  return [].concat( CipherTypes._types );
}

CipherTypes.register = function() {
  var type = arguments[0];
  var canonicalName = arguments[1];
  CipherTypes._types.push( canonicalName );
  for (var i = 1 ; i < arguments.length ; ++i ) {
    CipherTypes._map[ arguments[i] ] = type;
  }
}

CipherTypes.register( {
  key_len: 8,
  iv_len: 8,
  cipher: 'DES/CBC/PKCS5Padding',
  algorithm: 'DES',
}, "des" );

CipherTypes.register( {
  key_len: 16,
  iv_len: 16,
  cipher: 'AES/CBC/PKCS5Padding',
  algorithm: 'AES'
}, "aes-128-cbc" );

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

module.exports.CipherTypes = CipherTypes;
module.exports.createKeyAndIv = createKeyAndIv;