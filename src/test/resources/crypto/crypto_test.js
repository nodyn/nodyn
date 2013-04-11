load('vertx_tests.js');

var crypto = require('crypto');

function testCreateHash() {
  vassert.assertTrue(typeof crypto.createHash == 'function');
  var hash = crypto.createHash('sha1');
  vassert.assertTrue(hash instanceof crypto.Hash);
  vassert.assertEquals('sha1', hash.algorithm);
  vassert.testComplete();
}

function testSHA1HashDigest() {
  var hash = crypto.createHash('sha1');
  hash.update('Now is the winter of our discontent ');
  hash.update('made glorious summer');
  vassert.assertEquals('2365c163a22c69f11c2394ee6064fcfec1d19284', hash.digest('hex'));
  vassert.testComplete();
}

function testMD5HashDigest() {
  var hash = crypto.createHash('md5');
  hash.update('Now is the winter of our discontent ');
  hash.update('made glorious summer');
  vassert.assertEquals('74402c8710d5107209ee554e2e11bcf7', hash.digest('hex'));
  vassert.testComplete();
}

function testSHA256HashDigest() {
  var hash = crypto.createHash('sha256');
  hash.update('Now is the winter of our discontent ');
  hash.update('made glorious summer');
  vassert.assertEquals('453a07e8b7124e0cb136b7ef838e6dd78b2e4944f0e5546b802de6b774bec2e8', hash.digest('hex'));
  vassert.testComplete();
}

function testSHA512HashDigest() {
  var hash = crypto.createHash('sha512');
  hash.update('Now is the winter of our discontent ');
  hash.update('made glorious summer');
  vassert.assertEquals('e62168d80ddc7d992053122b166de7d8db0112422baf4b1255b7421789fd595a3be341c2740153579456fdecf8264a7fc2a0c7aa6851ae531b36ebe94ad16b61', hash.digest('hex'));
  vassert.testComplete();
}

initTests(this);
