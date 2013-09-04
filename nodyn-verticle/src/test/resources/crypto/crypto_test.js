var vertxTest = require('vertx_tests');
var vassert   = vertxTest.vassert;

var crypto = require('crypto');

var CryptoTests = {
  testCreateHash: function() {
    vassert.assertTrue(typeof crypto.createHash == 'function');
    var hash = crypto.createHash('sha1');
    vassert.assertTrue(hash instanceof crypto.Hash);
    vassert.assertEquals('sha1', hash.algorithm);
    vassert.testComplete();
  },

  testMD5HashDigest: function() {
      var hash = crypto.createHash('md5');
      hash.update('Now is the winter of our discontent ');
      hash.update('made glorious summer');
      vassert.assertEquals('74402c8710d5107209ee554e2e11bcf7', hash.digest('hex'));
      vassert.testComplete();
  },

  testSHA1HashDigest: function() {
    var hash = crypto.createHash('sha1');
    hash.update('Now is the winter of our discontent ');
    hash.update('made glorious summer');
    vassert.assertEquals('2365c163a22c69f11c2394ee6064fcfec1d19284', hash.digest('hex'));
    vassert.testComplete();
  },

  testSHA256HashDigest: function() {
    var hash = crypto.createHash('sha256');
    hash.update('Now is the winter of our discontent ');
    hash.update('made glorious summer');
    vassert.assertEquals('453a07e8b7124e0cb136b7ef838e6dd78b2e4944f0e5546b802de6b774bec2e8', hash.digest('hex'));
    vassert.testComplete();
  },

  testSHA512HashDigest: function() {
    var hash = crypto.createHash('sha512');
    hash.update('Now is the winter of our discontent ');
    hash.update('made glorious summer');
    vassert.assertEquals('e62168d80ddc7d992053122b166de7d8db0112422baf4b1255b7421789fd595a3be341c2740153579456fdecf8264a7fc2a0c7aa6851ae531b36ebe94ad16b61', hash.digest('hex'));
    vassert.testComplete();
  },

  testBase64MD5HashDigest: function() {
      var hash = crypto.createHash('md5');
      hash.update('Now is the winter of our discontent ');
      hash.update('made glorious summer');
      vassert.assertEquals('dEAshxDVEHIJ7lVOLhG89w==', hash.digest('base64'));
      vassert.testComplete();
  },

  testSHA1HashDigest: function() {
      var hash = crypto.createHash('sha1');
      hash.update('Now is the winter of our discontent ');
      hash.update('made glorious summer');
      vassert.assertEquals('I2XBY6IsafEcI5TuYGT8/sHRkoQ=', hash.digest('base64'));
      vassert.testComplete();
  },

  testBase64SHA256HashDigest: function() {
      var hash = crypto.createHash('sha256');
      hash.update('Now is the winter of our discontent ');
      hash.update('made glorious summer');
      vassert.assertEquals('RToH6LcSTgyxNrfvg45t14suSUTw5VRrgC3mt3S+wug=', hash.digest('base64'));
      vassert.testComplete();
  },

  testBase64SHA512HashDigest: function() {
      var hash = crypto.createHash('sha512');
      hash.update('Now is the winter of our discontent ');
      hash.update('made glorious summer');
      vassert.assertEquals('5iFo2A3cfZkgUxIrFm3n2NsBEkIrr0sSVbdCF4n9WVo740HCdAFTV5RW/ez4Jkp/wqDHqmhRrlMbNuvpStFrYQ==', hash.digest('base64'));
      vassert.testComplete();
  },

  testCreateHmac: function() {
      vassert.assertTrue(typeof crypto.createHmac == 'function');
      var key = 'Sweet home Alabama';
      var hmac = crypto.createHmac('sha1', key);
      vassert.assertTrue(hmac instanceof crypto.Hmac);
      vassert.assertEquals('sha1', hmac.algorithm);
      vassert.testComplete();
  },

  testMD5HmacDigest: function() {
      var key = 'Sweet home Alabama';
      var hmac = crypto.createHmac('md5', key);
      hmac.update('Where the skies are so blue ');
      hmac.update('Now we all did what we could do');
      vassert.assertEquals('f41e6884025c2ba61268df653ce16cb3', hmac.digest('hex'));
      vassert.testComplete();
  },

  testSHA1HmacDigest: function() {
      var key = 'Sweet home Alabama';
      var hmac = crypto.createHmac('sha1', key);
      hmac.update('Where the skies are so blue ');
      hmac.update('Now we all did what we could do');
      vassert.assertEquals('6f0dffb1b3cf8b612764873223eeb04ad81fb507', hmac.digest('hex'));
      vassert.testComplete();
  },

  testSHA256HmacDigest: function() {
      var key = 'Sweet home Alabama';
      var hmac = crypto.createHmac('sha256', key);
      hmac.update('Where the skies are so blue ');
      hmac.update('Now we all did what we could do');
      vassert.assertEquals('a2b7a34b1cee5c1db743ba53d5a9efb846e237d511404d0dfa63aca5fd1a286f', hmac.digest('hex'));
      vassert.testComplete();
  },

  testSHA512HmacDigest: function() {
      var key = 'Sweet home Alabama';
      var hmac = crypto.createHmac('sha512', key);
      hmac.update('Where the skies are so blue ');
      hmac.update('Now we all did what we could do');
      vassert.assertEquals('35c01c110092e5dcf9dcf4ca73dfd2ebc1e7b6a69de8036336b3afec8027e74858ebda7ff5061d8b8985189c6061d65c0c9a05c06c6b972d6113743e578faa17', hmac.digest('hex'));
      vassert.testComplete();
  },

  testBase64MD5HmacDigest: function() {
      var key = 'Sweet home Alabama';
      var hmac = crypto.createHmac('md5', key);
      hmac.update('Where the skies are so blue ');
      hmac.update('Now we all did what we could do');
      vassert.assertEquals('9B5ohAJcK6YSaN9lPOFssw==', hmac.digest('base64'));
      vassert.testComplete();
  },

  testBase64SHA1HmacDigest: function() {
      var key = 'Sweet home Alabama';
      var hmac = crypto.createHmac('sha1', key);
      hmac.update('Where the skies are so blue ');
      hmac.update('Now we all did what we could do');
      vassert.assertEquals('bw3/sbPPi2EnZIcyI+6wStgftQc=', hmac.digest('base64'));
      vassert.testComplete();
  },

  testBase64SHA1HmacDigest: function() {
      var key = 'Sweet home Alabama';
      var hmac = crypto.createHmac('sha256', key);
      hmac.update('Where the skies are so blue ');
      hmac.update('Now we all did what we could do');
      vassert.assertEquals('orejSxzuXB23Q7pT1anvuEbiN9URQE0N+mOspf0aKG8=', hmac.digest('base64'));
      vassert.testComplete();
  },

  testBase64SHA1HmacDigest: function() {
      var key = 'Sweet home Alabama';
      var hmac = crypto.createHmac('sha512', key);
      hmac.update('Where the skies are so blue ');
      hmac.update('Now we all did what we could do');
      vassert.assertEquals('NcAcEQCS5dz53PTKc9/S68Hntqad6ANjNrOv7IAn50hY69p/9QYdi4mFGJxgYdZcDJoFwGxrly1hE3Q+V4+qFw==', hmac.digest('base64'));
      vassert.testComplete();
  }
}
vertxTest.startTests(CryptoTests);
