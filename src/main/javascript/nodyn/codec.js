
var Buffer = require('buffer').Buffer;

var Codec = {};
var Base64 = {};

Base64.table = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";

Base64.encode = function(bytes) {
  if ( typeof bytes == 'string' ) {
    var strBytes = [];
    for ( var i = 0 ; i < bytes.length ; ++i ) {
      strBytes.push( bytes.charCodeAt(i) );
    }
    return Base64.encode( strBytes );
  }

  var s = '';
  var num = 0;
  var prev = 0;
  for ( var i = 0, pos = 0 ; i < bytes.length ; ++i, pos = (++pos) % 3) {
    var b = bytes[i];
    var o;
    if ( pos == 0 ) {
      o = ( b >> 2 ) & 0x3f;
      s = s + Base64.table.charAt( o );
    } else if ( pos == 1 ) {
      o = ( ( prev << 4 ) | ( b >> 4 ) ) & 0x3f;
      s = s + Base64.table.charAt( o );
    } else if ( pos == 2 ) {
      o = ( ( prev << 2 ) | ( b >> 6 ) ) & 0x3f;
      s = s + Base64.table.charAt( o );
      o = b & 0x3f;
      s = s + Base64.table.charAt( o );
    }
    prev = b;
  }

  if ( pos == 1 ) {
    s = s + Base64.table.charAt( ( prev << 4 )  & 0x3f );
    s = s + '==';
  } else if ( pos == 2 ) {
    s = s + Base64.table.charAt( ( prev << 2 )  & 0x3f );
    s = s + '=';
  }

  return s;
}

var Hex = {};

Hex.encode = function(bytes) {
  var s = '';
  for ( var i = 0 ; i < bytes.length ; ++i ) {
    var chunk = Number(bytes[i] & 0xFF).toString(16);
    if ( chunk.length == 2 ) {
      s = s + '' + chunk;
    } else {
      s = s + '0' + chunk;
    }
  }
  return s;
}

var Codec = {
  Base64: Base64,
  Hex: Hex,
}

module.exports = Codec;