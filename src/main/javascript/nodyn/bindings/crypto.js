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

function CipherBase(encipher){
  this._encipher = encipher;
}

CipherBase.prototype.init = function(cipher, password) {
  this._delegate = new io.nodyn.crypto.Cipher( this._encipher, cipher, password._nettyBuffer() );
}

CipherBase.prototype.initiv = function(cipher, key, iv) {
  this._delegate = new io.nodyn.crypto.Cipher( this._encipher, cipher, key._nettyBuffer(), iv._nettyBuffer() );
}


CipherBase.prototype.update = update;

CipherBase.prototype.final = function() {
  return process.binding('buffer').createBuffer( this._delegate.doFinal() );
}

module.exports.CipherBase = CipherBase;

