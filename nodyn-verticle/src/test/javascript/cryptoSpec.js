var helper = require('specHelper');
var crypto = require('crypto');

describe("crypto module", function() {
  it('should pass testCreateHash', function() {
    expect(typeof crypto.createHash).toBe('function');
    var hash = crypto.createHash('sha1');
    expect(hash instanceof crypto.Hash).toBe(true);
    expect(hash.algorithm).toBe('sha1');
  });

  it('should pass testMD5HashDigest', function() {
      var hash = crypto.createHash('md5');
      hash.update('Now is the winter of our discontent ');
      hash.update('made glorious summer');
      expect(hash.digest('hex')).toBe('74402c8710d5107209ee554e2e11bcf7');
  });

  it('should pass testSHA1HashDigest', function() {
    var hash = crypto.createHash('sha1');
    hash.update('Now is the winter of our discontent ');
    hash.update('made glorious summer');
    expect(hash.digest('hex')).toBe('2365c163a22c69f11c2394ee6064fcfec1d19284');
  });

  it('should pass testSHA256HashDigest', function() {
    var hash = crypto.createHash('sha256');
    hash.update('Now is the winter of our discontent ');
    hash.update('made glorious summer');
    expect(hash.digest('hex')).toBe('453a07e8b7124e0cb136b7ef838e6dd78b2e4944f0e5546b802de6b774bec2e8');
  });

  it('should pass testSHA512HashDigest', function() {
    var hash = crypto.createHash('sha512');
    hash.update('Now is the winter of our discontent ');
    hash.update('made glorious summer');
    expect(hash.digest('hex')).toBe('e62168d80ddc7d992053122b166de7d8db0112422baf4b1255b7421789fd595a3be341c2740153579456fdecf8264a7fc2a0c7aa6851ae531b36ebe94ad16b61');
  });

  it('should pass testBase64MD5HashDigest', function() {
      var hash = crypto.createHash('md5');
      hash.update('Now is the winter of our discontent ');
      hash.update('made glorious summer');
      expect(hash.digest('base64')).toBe('dEAshxDVEHIJ7lVOLhG89w==');
  });

  it('should pass testSHA1HashDigest', function() {
      var hash = crypto.createHash('sha1');
      hash.update('Now is the winter of our discontent ');
      hash.update('made glorious summer');
      expect(hash.digest('base64')).toBe('I2XBY6IsafEcI5TuYGT8/sHRkoQ=');
  });

  it('should pass testBase64SHA256HashDigest', function() {
      var hash = crypto.createHash('sha256');
      hash.update('Now is the winter of our discontent ');
      hash.update('made glorious summer');
      expect(hash.digest('base64')).toBe('RToH6LcSTgyxNrfvg45t14suSUTw5VRrgC3mt3S+wug=');
  });

  it('should pass testBase64SHA512HashDigest', function() {
      var hash = crypto.createHash('sha512');
      hash.update('Now is the winter of our discontent ');
      hash.update('made glorious summer');
      expect(hash.digest('base64')).toBe('5iFo2A3cfZkgUxIrFm3n2NsBEkIrr0sSVbdCF4n9WVo740HCdAFTV5RW/ez4Jkp/wqDHqmhRrlMbNuvpStFrYQ==');
  });

  it('should pass testCreateHmac', function() {
      expect(typeof crypto.createHmac).toBe('function');
      var key = 'Sweet home Alabama';
      var hmac = crypto.createHmac('sha1', key);
      expect(hmac instanceof crypto.Hmac).toBe(true);
      expect(hmac.algorithm).toBe('sha1');
  });

  it('should pass testMD5HmacDigest', function() {
      var key = 'Sweet home Alabama';
      var hmac = crypto.createHmac('md5', key);
      hmac.update('Where the skies are so blue ');
      hmac.update('Now we all did what we could do');
      expect(hmac.digest('hex')).toBe('f41e6884025c2ba61268df653ce16cb3');
  });

  it('should pass testSHA1HmacDigest', function() {
      var key = 'Sweet home Alabama';
      var hmac = crypto.createHmac('sha1', key);
      hmac.update('Where the skies are so blue ');
      hmac.update('Now we all did what we could do');
      expect(hmac.digest('hex')).toBe('6f0dffb1b3cf8b612764873223eeb04ad81fb507');
  });

  it('should pass testSHA256HmacDigest', function() {
      var key = 'Sweet home Alabama';
      var hmac = crypto.createHmac('sha256', key);
      hmac.update('Where the skies are so blue ');
      hmac.update('Now we all did what we could do');
      expect(hmac.digest('hex')).toBe('a2b7a34b1cee5c1db743ba53d5a9efb846e237d511404d0dfa63aca5fd1a286f');
  });

  it('should pass testSHA512HmacDigest', function() {
      var key = 'Sweet home Alabama';
      var hmac = crypto.createHmac('sha512', key);
      hmac.update('Where the skies are so blue ');
      hmac.update('Now we all did what we could do');
      expect(hmac.digest('hex')).toBe('35c01c110092e5dcf9dcf4ca73dfd2ebc1e7b6a69de8036336b3afec8027e74858ebda7ff5061d8b8985189c6061d65c0c9a05c06c6b972d6113743e578faa17');
  });

  xit('should pass testBase64MD5HmacDigest', function() {
      var key = 'Sweet home Alabama';
      var hmac = crypto.createHmac('md5', key);
      hmac.update('Where the skies are so blue ');
      hmac.update('Now we all did what we could do');
      expect(hmac.digest('base64')).toBe('9B5ohAJcK6YSaN9lPOFssw==');
  });

  xit('should pass testBase64SHA1HmacDigest', function() {
      var key = 'Sweet home Alabama';
      var hmac = crypto.createHmac('sha1', key);
      hmac.update('Where the skies are so blue ');
      hmac.update('Now we all did what we could do');
      expect(hmac.digest('base64')).toBe('bw3/sbPPi2EnZIcyI+6wStgftQc=');
  });

  xit('should pass testBase64SHA256HmacDigest', function() {
      var key = 'Sweet home Alabama';
      var hmac = crypto.createHmac('sha256', key);
      hmac.update('Where the skies are so blue ');
      hmac.update('Now we all did what we could do');
      expect(hmac.digest('base64')).toBe('orejSxzuXB23Q7pT1anvuEbiN9URQE0N+mOspf0aKG8=');
  });

  xit('should pass testBase64SHA512HmacDigest', function() {
      var key = 'Sweet home Alabama';
      var hmac = crypto.createHmac('sha512', key);
      hmac.update('Where the skies are so blue ');
      hmac.update('Now we all did what we could do');
      expect(hmac.digest('base64')).toBe('NcAcEQCS5dz53PTKc9/S68Hntqad6ANjNrOv7IAn50hY69p/9QYdi4mFGJxgYdZcDJoFwGxrly1hE3Q+V4+qFw==');
  });
});
