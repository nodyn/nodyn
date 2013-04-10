load('vertx_tests.js');

var crypto = require('crypto');

function testCreateHash() {
  vassert.assertTrue(typeof crypto.createHash == 'function');
  var hash = crypto.createHash('sha1');
  vassert.assertTrue(hash instanceof crypto.Hash);
  vassert.assertEquals('sha1', hash.algorithm);
  vassert.testComplete();
}

function testHashUpdate() {
  var hash = crypto.createHash('sha1');
  hash.update('Now is the winter of our discontent ');
  hash.update('made glorious summer');
  vassert.testComplete();
}

initTests(this);
