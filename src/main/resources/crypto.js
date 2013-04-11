var util = require('util');
var Stream = require('stream');

module.exports.createHash = function(algorithm) {
  return new Hash(algorithm);
}

var Hash = module.exports.Hash = function(algorithm) {
  var that = this;
  that.algorithm = algorithm;
  that.buffer    = ""; // TODO: Use a real buffer
  that.proxy     = new org.projectodd.nodej.crypto.Hash(algorithm);

  that.update = that.proxy.update.bind(that.proxy);
  that.digest = that.proxy.digest.bind(that.proxy);
}

// TODO: 
// The node.js API has changed, and a Hash is now a Stream
// As part of this change, node.js introduced a bunch of new
// Stream types and functionality that we do not support yet.
// Let's see how well we do by just inheriting from our current
// Stream implementation.
util.inherits(Stream, Hash);

