var helper = require('specHelper');
var crypto = require('crypto');

describe("crypto pbkdf2 functions", function() {

  it( "should produce the same key as node, in its sync form", function() {
    var key = crypto.pbkdf2Sync( "I like tacos", "beef", 10, 8 );
    expect( key.toString('base64') ).toBe( '8AavpPHN8uw=' );
  })

  it( "should produce the same key as node, in its callback form", function() {
    helper.testComplete(false);
    waitsFor(helper.testComplete, "the callback should receive key" );
    var key = crypto.pbkdf2( "I like tacos", "beef", 10, 8, function(err, key) {
      expect( key.toString('base64') ).toBe( '8AavpPHN8uw=' );
      helper.testComplete(true);
    } );
  })

});

