var specHelper = require('specHelper'),
    zlib = require('zlib');

describe('The zlib module', function() {

  it('should have a createGzip function that returns a Gzip object', function() {
    var gzip = zlib.createGzip();
    expect(gzip instanceof zlib.Gzip).toBe(true);
  });

  describe('Deflater', function() {

    it('should deflate a string and have the result look like node.js', function() {
      var str = 'Now is the winter of our discontent made glorious summer by this Son of York';
      zlib.deflate(str, function(e,b) {
        expect(e).toBeFalsy();
        expect(b.toString('base64')).toBe('eJwVy7sNgDAQBNFWtiISIkLABk5gr3QfWXTPkY7mTRwQg18VQ7pXBQ8wFEVsZ4buaGupOB+qMAwWreW2vYlSzuw/Waj3BzTBG/I=');
      });
    });
  });

});
