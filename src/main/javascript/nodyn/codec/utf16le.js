
var UTF16LE = {};

UTF16LE.toString = function() {
  return "utf16-le";
}

UTF16LE.encode = function(bytes) {
  return bytes.delegate.toString( 'utf-16le');
}

module.exports = UTF16LE;