
var Helper = org.projectodd.nodyn.buffer.Helper;
var Buffer = require('buffer').Buffer;
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

Base64.decode = function(input) {
  if ( typeof input == 'string' ) {
    input = new Buffer(input);
    //var bytes = Helper.bytes( input, 'utf-8' );
    //System.err.println( "bytes: " + bytes );
    //var input = new Buffer(bytes);
    //return Base64.decode( new Buffer( bytes ) );
  }

  var bytes = [];

  var b1, b2, b3, b4;
  var v1, v2, v3, v4;
  var o1, o2, o3;

  for ( i = 0 ; i < input.length ; i = i + 4 ) {
    b1 = input[i+0];
    b2 = input[i+1];
    b3 = input[i+2];
    b4 = input[i+3];

    v1 = Base64.table.indexOf( String.fromCharCode( b1 ) );
    v2 = Base64.table.indexOf( String.fromCharCode( b2 ) );
    v3 = Base64.table.indexOf( String.fromCharCode( b3 ) );
    v4 = Base64.table.indexOf( String.fromCharCode( b4 ) );

    o1 = ( ( v1 << 2 ) | ( v2 >> 4 ) ) & 0xFF;
    bytes.push( o1 );
    if ( v3 == 64 ) {
      break;
    }
    o2 = ( ( v2 << 4 ) | ( v3 >> 2 ) ) & 0xFF;
    bytes.push( o2 );
    if ( v4 == 64 ) {
      break;
    }
    o3 = ( ( v3 << 6 ) | ( v4 ) ) & 0xFF;
    bytes.push( o3 );
  }

  return new Buffer( bytes );
}

module.exports = Base64;