var helper = require('specHelper');

describe('The string_decoder module', function() {

  // TODO: Figure out why this fails
  it('should pass a basic test', function() {
    var StringDecoder = require('string_decoder').StringDecoder;
    var decoder = new StringDecoder('utf8');
    var cent = new Buffer([0xC2, 0xA2]);
    expect(decoder.write(cent)).toBe("¢");
  });
});

