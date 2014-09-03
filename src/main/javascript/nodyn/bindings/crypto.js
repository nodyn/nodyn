/*
 * Copyright 2014 Red Hat, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

function update(chunk, encoding) {
  if ( Buffer.isBuffer( chunk ) ) {
    this._delegate.update( chunk._nettyBuffer() );
  } else {
    this._delegate.update( new Buffer( chunk, encoding )._nettyBuffer() );
  }
}

function digest(outputEncoding) {
  var buf = process.binding('buffer').createBuffer( this._delegate.digest() );

  if ( outputEncoding && outputEncoding != 'buffer' ) {
    return buf.toString( outputEncoding );
  }

  return buf;
}

var hashAlgorithms = {
  'md4':       org.bouncycastle.crypto.digests.MD4Digest,
  'md5':       org.bouncycastle.crypto.digests.MD5Digest,
  'sha1':      org.bouncycastle.crypto.digests.SHA1Digest,
  'sha3':      org.bouncycastle.crypto.digests.SHA3Digest,
  'sha224':    org.bouncycastle.crypto.digests.SHA224Digest,
  'sha256':    org.bouncycastle.crypto.digests.SHA256Digest,
  'sha384':    org.bouncycastle.crypto.digests.SHA384Digest,
  'sha512':    org.bouncycastle.crypto.digests.SHA512Digest,
  'ripemd120': org.bouncycastle.crypto.digests.RIPEMD128Digest,
  'ripemd160': org.bouncycastle.crypto.digests.RIPEMD160Digest,
  'ripemd256': org.bouncycastle.crypto.digests.RIPEMD256Digest,
  'ripemd320': org.bouncycastle.crypto.digests.RIPEMD320Digest,
  'rmd160':    org.bouncycastle.crypto.digests.RIPEMD160Digest,
  'whirlpool': org.bouncycastle.crypto.digests.WhirlpoolDigest,
};

function Hash(algorithm) {
  if ( ! this instanceof Hash ) { return new Hash(algorithm); }

  var algo = hashAlgorithms[ algorithm ];

  if ( ! algo ) {
    throw new Error( "Digest method not supported" );
  }

  this._delegate = new io.nodyn.crypto.Hash( new algo() );
};

Hash.prototype.update = update;
Hash.prototype.digest = digest;

module.exports.Hash = Hash;
module.exports.getHashes = function() {
  var hashes = [];
  for ( n in hashAlgorithms ) {
    hashes.push( n );
  }
  return hashes;
}

function Hmac() {
  if ( ! this instanceof Hmac ) { return new Hmac(); }
}

Hmac.prototype.init = function(algorithm, key) {

  var algo = hashAlgorithms[ algorithm ];

  if ( ! algo ) {
    throw new Error( "Digest method not supported" );
  }

  this._delegate = new io.nodyn.crypto.Hmac( new algo(), key._nettyBuffer() );
}

Hmac.prototype.update = update;
Hmac.prototype.digest = digest;

module.exports.Hmac = Hmac;

var engines  = org.bouncycastle.crypto.engines;
var modes    = org.bouncycastle.crypto.modes;
var paddings = org.bouncycastle.crypto.paddings;

function cbc(cipher) {
  return new modes.CBCBlockCipher(cipher);
}

function cfb(cipher) {
  return new modes.CFBBlockCipher(cipher);
}

function ecb(cipher) {
  // nothing, just here for consistency
  return cipher;
}

function buffered(cipher) {
  return new org.bouncycastle.crypto.BufferedBlockCipher( cipher );
}

function pkcs7(cipher) {
  return new paddings.PaddedBufferedBlockCipher( cipher, new paddings.PKCS7Padding() );
}

var cipherAlgorithms = {};

function registerCipher(name, keyLen, ivLen, factory) {
  cipherAlgorithms[name] = {
    keyLen:  keyLen,
    ivLen:   ivLen,
    factory: factory,
  };
}

function aes_cbc() {
  return pkcs7( cbc( new engines.AESEngine() ) );
}

function aes_ecb() {
  return pkcs7( ecb( new engines.AESEngine() ) );
}

registerCipher( 'aes128',      128, 16, aes_cbc );
registerCipher( 'aes-128-cbc', 128, 16, aes_cbc );
registerCipher( 'aes-128-ecb', 128, 0,  aes_ecb );

registerCipher( 'aes192',      192, 16, aes_cbc );
registerCipher( 'aes-192-cbc', 192, 16, aes_cbc );
registerCipher( 'aes-192-ecb', 192, 0,  aes_ecb );

registerCipher( 'aes256',      256, 16, aes_cbc );
registerCipher( 'aes-256-cbc', 256, 16, aes_cbc );
registerCipher( 'aes-256-ecb', 256, 0,  aes_ecb );

function bf_cbc() {
  return pkcs7( cbc( new engines.BlowfishEngine() ) );
}

function bf_ecb() {
  return pkcs7( cbc( new engines.BlowfishEngine() ) );
}

registerCipher( 'bf',     128, 8, bf_cbc );
registerCipher( 'bf-cbc', 128, 8, bf_cbc );
registerCipher( 'bf-ecb', 128, 0, bf_ecb );
registerCipher( 'blowfish', 128, 0, bf_ecb );

function camellia_cbc() {
  return pkcs7( cbc( new engines.CamelliaEngine() ) );
}

function camellia_ecb() {
  return pkcs7( ecb( new engines.CamelliaEngine() ) );
}

registerCipher( 'camellia128',      128, 16, camellia_cbc );
registerCipher( 'camellia-128-cbc', 128, 16, camellia_cbc );
registerCipher( 'camellia-128-ecb', 128, 0,  camellia_ecb );

registerCipher( 'camellia192',      192, 16, camellia_cbc );
registerCipher( 'camellia-192-cbc', 192, 16, camellia_cbc );
registerCipher( 'camellia-192-ecb', 192, 0,  camellia_ecb );

registerCipher( 'camellia256',      256, 16, camellia_cbc );
registerCipher( 'camellia-256-cbc', 256, 16, camellia_cbc );
registerCipher( 'camellia-256-ecb', 256, 0,  camellia_ecb );

registerCipher( 'des', 64, 8,
  function() { return pkcs7( cbc( new engines.DESEngine() ) ); }
);

function generateKeyIv(password, algo) {
  return new io.nodyn.crypto.OpenSSLKDF( password._nettyBuffer(), algo.keyLen, algo.ivLen );
}

function CipherBase(encipher){
  this._encipher = encipher;
}

CipherBase.prototype.init = function(cipher, password) {
  var algo = cipherAlgorithms[cipher];
  if ( ! algo ) {
    throw new Error( "Unknown cipher: " + cipher );
  }

  var keyIv = generateKeyIv( password, algo );

  this.initiv( cipher,
               process.binding('buffer').createBuffer( keyIv.key ),
               process.binding('buffer').createBuffer( keyIv.iv ) );
}

CipherBase.prototype.initiv = function(cipher, key, iv) {

  var algo = cipherAlgorithms[cipher];
  if ( ! algo ) {
    throw new Error( "Cipher method not supported" );
  }

  this._delegate = new io.nodyn.crypto.Cipher( this._encipher, algo.factory(), key._nettyBuffer(), iv._nettyBuffer() );
}


CipherBase.prototype.update = update;

CipherBase.prototype.final = function() {
  return process.binding('buffer').createBuffer( this._delegate.doFinal() );
}

module.exports.CipherBase = CipherBase;

module.exports.getCiphers = function() {
  var ciphers = [];
  for ( n in cipherAlgorithms ) {
    ciphers.push( n );
  }
  return ciphers;
}


