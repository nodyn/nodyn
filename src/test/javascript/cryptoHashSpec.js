
var helper = require('specHelper');
var crypto = require('crypto');

describe("crypto Hash module", function() {

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

  it( 'should digest to a buffer if not otherwise specified', function() {
    var hash = crypto.createHash('md5');
    hash.update('Now is the winter of our discontent ');
    hash.update('made glorious summer');
    var buf = hash.digest();
    // <74 40 2c 87 10 d5 10 72 09 ee 55 4e 2e 11 bc f7>
    expect( buf[0] ).toBe( 0x74 )
    expect( buf[1] ).toBe( 0x40 )
    expect( buf[2] ).toBe( 0x2c )
    expect( buf[3] ).toBe( 0x87 )
    expect( buf[4] ).toBe( 0x10 )
    expect( buf[5] ).toBe( 0xd5 )
    expect( buf[6] ).toBe( 0x10 )
    expect( buf[7] ).toBe( 0x72 )
    expect( buf[8] ).toBe( 0x09 )
    expect( buf[9] ).toBe( 0xee )
    expect( buf[10] ).toBe( 0x55 )
    expect( buf[11] ).toBe( 0x4e )
    expect( buf[12] ).toBe( 0x2e )
    expect( buf[13] ).toBe( 0x11 )
    expect( buf[14] ).toBe( 0xbc )
    expect( buf[15] ).toBe( 0xf7 )
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

  it('should treat hashes as streams', function() {
      var hash = crypto.createHash('sha512');
      hash.write('Now is the winter of our discontent ' );
      hash.write('made glorious summer');
      expect(hash.digest('base64')).toBe('5iFo2A3cfZkgUxIrFm3n2NsBEkIrr0sSVbdCF4n9WVo740HCdAFTV5RW/ez4Jkp/wqDHqmhRrlMbNuvpStFrYQ==');
  } );

});