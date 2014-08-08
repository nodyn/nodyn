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

function Hash(algorithm) {
  if ( ! this instanceof Hash ) { return new Hash(algorithm); }

  this._hash = new io.nodyn.crypto.Hash( algorithm );
}

Hash.prototype.update = function(chunk, encoding) {
  if ( Buffer.isBuffer( chunk ) ) {
    this._hash.update( chunk._nettyBuffer() );
  } else {
    this._hash.update( new Buffer( chunk, encoding )._nettyBuffer() );
  }
}

Hash.prototype.digest = function(outputEncoding) {
  var buf = process.binding('buffer').createBuffer( this._hash.digest() );

  if ( outputEncoding ) {
    return buf.toString( outputEncoding );
  }

  return buf;
}

module.exports.Hash = Hash;