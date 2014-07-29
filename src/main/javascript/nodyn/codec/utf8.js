var UTF8 = {};

UTF8.toString = function() {
  return "utf8";
}

UTF8.encode = function(bytes) {
  return bytes._buffer.toString('utf-8');
}

module.exports = UTF8;