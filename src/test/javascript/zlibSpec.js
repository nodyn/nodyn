var specHelper = require('./specHelper'),
    zlib = require('zlib');

describe('The zlib module', function() {

  it('should have a createGzip function that returns a Gzip object', function() {
    var gzip = zlib.createGzip();
    expect(gzip instanceof zlib.Gzip).toBe(true);
  });

});
