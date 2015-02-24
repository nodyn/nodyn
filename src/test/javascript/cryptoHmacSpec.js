var helper = require('./specHelper');
var crypto = require('crypto');

describe("crypto Hmac module", function() {

  xit('should pass testCreateHmac', function() {
      expect(typeof crypto.createHmac).toBe('function');
      var key = 'Sweet home Alabama';
      var hmac = crypto.createHmac('sha1', key);
      expect(hmac instanceof crypto.Hmac).toBe(true);
  });

  it('should pass testMD5HmacDigest', function() {
      var hash = crypto.createHash('md5');
      hash.update('Now is the winter of our discontent ');
      var key = 'Sweet home Alabama';
      var hmac = crypto.createHmac('md5', key);
      hmac.update('Where the skies are so blue ');
//      hmac.update('Now we all did what we could do');
//      expect(hmac.digest('hex')).toBe('f41e6884025c2ba61268df653ce16cb3');
  });

  xit('should pass testSHA1HmacDigest', function() {
      var key = 'Sweet home Alabama';
      var hmac = crypto.createHmac('sha1', key);
      hmac.update('Where the skies are so blue ');
      hmac.update('Now we all did what we could do');
      expect(hmac.digest('hex')).toBe('6f0dffb1b3cf8b612764873223eeb04ad81fb507');
  });

  xit('should pass testSHA256HmacDigest', function() {
      var key = 'Sweet home Alabama';
      var hmac = crypto.createHmac('sha256', key);
      hmac.update('Where the skies are so blue ');
      hmac.update('Now we all did what we could do');
      expect(hmac.digest('hex')).toBe('a2b7a34b1cee5c1db743ba53d5a9efb846e237d511404d0dfa63aca5fd1a286f');
  });

  xit('should pass testSHA512HmacDigest', function() {
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

  xit('should treat HMacs as streams', function() {
      var key = 'Sweet home Alabama';
      var hmac = crypto.createHmac('sha512', key);
      hmac.write('Where the skies are so blue ');
      hmac.write('Now we all did what we could do');
      expect(hmac.digest('base64')).toBe('NcAcEQCS5dz53PTKc9/S68Hntqad6ANjNrOv7IAn50hY69p/9QYdi4mFGJxgYdZcDJoFwGxrly1hE3Q+V4+qFw==');
  });

});
