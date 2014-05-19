
var Buffer = require('buffer').Buffer;

var Codec = {};
var Base64 = {};

Base64.table = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";

Base64.toString = function() {
  return "base64";
}

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

Hex.toString = function() {
  return "hex";
}

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

var UTF8 = {};

UTF8.toString = function() {
  return "utf8";
}

UTF8.encode = function(bytes) {
  return bytes.delegate.toString('utf-8');
}

var USASCII = {};

USASCII.toString = function() {
  return "us-ascii";
}

USASCII.encode = function(bytes) {
  return bytes.delegate.toString( 'us-ascii' );
}

var UTF16LE = {};

UTF16LE.toString = function() {
  return "utf16-le";
}

UTF16LE.encode = function(bytes) {
  return bytes.delegate.toString( 'utf-16le');
}

function get(enc) {
  enc = enc.toLowerCase();
  if ( enc == 'ascii' || enc == 'us-ascii') {
    return USASCII;
  }

  if ( enc == 'utf8' || enc == 'utf-8') {
    return UTF8;
  }

  if ( enc == 'ucs2' || enc == 'utf16le' || enc == 'utf-16le' ) {
    return UTF16LE;
  }

  if ( enc == 'hex' ) {
    return Hex;
  }

  if ( enc == 'base64' ) {
    return Base64;
  }
}


var Codec = {
  get: get,
  Base64: Base64,
  Hex: Hex,
  UTF8: UTF8,
  UTF16LE: UTF16LE,
  USASCII: USASCII,
}

module.exports = Codec;