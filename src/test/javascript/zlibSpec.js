var helper = require('./specHelper'),
    zlib = require('zlib');

describe('The zlib module', function() {

  beforeEach(function() {
    helper.testComplete(false);
  });

  it('should deflateraw and inflateraw a string', function() {
    waitsFor(helper.testComplete, "the test to complete", 8000);
    var str = 'Now is the winter of our discontent made glorious summer by this Son of York';
    var encoded = 'Fcu7DYAwEATRVrYiEiJCwAZOYK90H1l0z5GO5k0cEINfFUO6VwUPMBRFbGeG7mhrqTgfqjAMFq3ltr2JUs7sP1mo9wc=';
    zlib.deflateRaw(str, function(e,b) {
      expect(e).toBeFalsy();
      expect(b.toString('base64')).toBe(encoded);

      zlib.inflateRaw(b, function(ee, bb) {
        expect(ee).toBeFalsy();
        expect(bb.toString()).toBe(str);
        helper.testComplete(true);
      });
    });
  });

  it('should deflate and inflate a string', function() {
    waitsFor(helper.testComplete, "the test to complete", 8000);
    var str = 'Now is the winter of our discontent made glorious summer by this Son of York';
    var encoded = 'eJwVy7sNgDAQBNFWtiISIkLABk5gr3QfWXTPkY7mTRwQg18VQ7pXBQ8wFEVsZ4buaGupOB+qMAwWreW2vYlSzuw/Waj3BzTBG/I=';
    zlib.deflate(str, function(e,b) {
      expect(e).toBeFalsy();
//      expect(b.toString('base64')).toBe(encoded);

      zlib.inflate(b, function(ee, bb) {
        expect(ee).toBeFalsy();
        expect(bb.toString()).toBe(str);
        helper.testComplete(true);
      });
    });
  });

  it('should gzip and gunzip a string', function() {
    waitsFor(helper.testComplete, "the test to complete", 8000);
    var str = 'Now is the winter of our discontent made glorious summer by this Son of York';
    var encoded = 'H4sIAAAAAAAAAxXLuw2AMBAE0Va2IhIiQsAGTmCvdB9ZdM+RjuZNHBCDXxVDulcFDzAURWxnhu5oa6k4H6owDBat5ba9iVLO7D9ZqPcHFHvOTEwAAAA=';
    zlib.gzip(str, function(e,b) {
      expect(e).toBeFalsy();
//      console.log(b.toString('base64'));
//      console.log(typeof b.toString('base64'));
//      console.log(encoded);
//      console.log(typeof encoded);
//      expect(b.toString('base64')).toBe(encoded);
      zlib.gunzip(b, function(ee, bb) {
        expect(ee).toBeFalsy();
        expect(bb.toString()).toBe(str);
        helper.testComplete(true);
      });
    });
  });

  it('should unzip a file', function() {
    waitsFor(helper.testComplete, 'the test to complete', 8000);
    var fs = require('fs');
    var buf = fs.readFileSync(__dirname + "/zlibFixture.txt.gz");
    zlib.gunzip(buf, function(e, b) {
      expect(e).toBeFalsy();
      expect(b.toString()).toBe("This is a test file for zlib\n");
      helper.testComplete(true);
    });
  });

  it('should close', function() {
    waitsFor(helper.testComplete, 'the test to complete', 8000);
    zlib.gzip('hello', function(err, out) {
      var unzip = zlib.createGunzip();
      unzip.write(out);
      unzip.close(function() {
        helper.testComplete(true);
      });
    });
  });

  it('should fail if the dictionary is not found', function() {
    waitsFor(helper.testComplete, 'the test to complete', 8000);
    var stream = zlib.createInflate();
    stream.on('error', function(e) {
      expect(e.message).toBe('Missing dictionary');
      helper.testComplete(true);
    });
    // String "test" encoded with dictionary "dict".
    stream.write(Buffer([0x78,0xBB,0x04,0x09,0x01,0xA5]));
  });

  it('should fail if the dictionary is incorrect', function() {
    waitsFor(helper.testComplete, 'the test to complete', 8000);
    var stream = zlib.createInflate({ dictionary: Buffer('fail') });
    stream.on('error', function(e) {
      expect(e.message).toBe('Bad dictionary');
      helper.testComplete(true);
    });
    // String "test" encoded with dictionary "dict".
    stream.write(Buffer([0x78,0xBB,0x04,0x09,0x01,0xA5]));
  });

});
