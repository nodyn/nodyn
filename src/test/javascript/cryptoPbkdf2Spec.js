var helper = require('specHelper');
var crypto = require('crypto');

describe("crypto pbkdf2 functions", function() {

  it( "should produce the same key as node, in its Sync form", function() {
    var key = crypto.pbkdf2Sync( "I like tacos", "beef", 10, 8 );
    expect( key.toString('base64') ).toBe( '8AavpPHN8uw=' );
  })

});

