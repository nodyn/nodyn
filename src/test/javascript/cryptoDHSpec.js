var helper = require('./specHelper');
var crypto = require('crypto');

describe("crypto diffie-hellman", function() {

  it( "should be able to get groups by name", function() {
    var g = crypto.getDiffieHellman( "modp2" );

    expect( g ).not.toBe( undefined );

    expect( g.generateKeys().length ).toBe( 128 );

    var publicKey = g.getPublicKey();

    expect( publicKey ).not.toBe( undefined );

    expect( publicKey.length ).toBe( 128 );
  });

  it( "should work with Bob and Alice", function() {
    var alice = crypto.getDiffieHellman('modp2');
    var bob   = crypto.getDiffieHellman('modp2');

    alice.generateKeys();
    bob.generateKeys();

    var aliceSecret = alice.computeSecret(bob.getPublicKey(), null, 'hex');
    var bobSecret = bob.computeSecret(alice.getPublicKey(), null, 'hex');

    expect( aliceSecret ).toBe( bobSecret );
  });

  it ("should be able to create a DH", function() {
    var alice = crypto.createDiffieHellman( 1024 );
    expect( alice.getPrime().length ).toBe( 1024 / 8 );
  })

});
