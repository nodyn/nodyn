
var USASCII = {};

USASCII.toString = function() {
  return "us-ascii";
}

USASCII.encode = function(bytes) {
  return bytes.delegate.toString( 'us-ascii' );
}

module.exports = USASCII;