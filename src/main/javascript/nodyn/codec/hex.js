
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

module.exports = Hex;