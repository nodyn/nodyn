
var USASCII = {};

USASCII.toString = function() {
  return "us-ascii";
}

USASCII.encode = function(bytes) {
  return bytes._buffer.toString( 'us-ascii' );
}

module.exports = USASCII;