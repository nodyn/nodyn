"use strict";

var nodyn        = require('nodyn');
var Helper       = org.projectodd.nodyn.buffer.Helper;
var Random       = java.util.Random;
var SecureRandom = java.security.SecureRandom;

function randomBytes(sourceClass, size, callback) {
  if ( callback ) {
    nodyn.asyncAction( function() { return randomBytes( sourceClass, size ) }, callback );
  } else {
    var source = new sourceClass();
    var b = Helper.newByteArray(size);
    source.nextBytes( b );
    return new Buffer( b );
  }
}

module.exports = {
  randomBytes: function(size, callback) {
    return randomBytes( SecureRandom, size, callback );
  },
  pseudoRandomBytes: function(size, callback) {
    return randomBytes( Random, size, callback );
  }

}