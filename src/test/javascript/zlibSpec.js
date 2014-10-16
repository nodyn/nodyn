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
 //     expect(b.toString('base64')).toBe(encoded.toString());
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

});
