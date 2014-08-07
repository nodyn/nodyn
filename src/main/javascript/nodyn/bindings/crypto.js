
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