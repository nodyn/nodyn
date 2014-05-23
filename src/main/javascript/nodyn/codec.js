
var Codec = {};


Codec.Base64  = require('nodyn/codec/base64');
Codec.Hex     = require('nodyn/codec/hex');
Codec.UTF8    = require('nodyn/codec/utf8');
Codec.UTF16LE = require('nodyn/codec/utf16le');
Codec.USASCII = require('nodyn/codec/us_ascii');

Codec.get = function(enc) {
  enc = enc.toLowerCase();

  if ( enc == 'ascii' || enc == 'us-ascii') {
    return Codec.USASCII;
  }

  if ( enc == 'utf8' || enc == 'utf-8') {
    return Codec.UTF8;
  }

  if ( enc == 'ucs2' || enc == 'utf16le' || enc == 'utf-16le' ) {
    return Codec.UTF16LE;
  }

  if ( enc == 'hex' ) {
    return Codec.Hex;
  }

  if ( enc == 'base64' ) {
    return Codec.Base64;
  }
}


module.exports = Codec;
