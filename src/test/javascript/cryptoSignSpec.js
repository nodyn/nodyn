var helper = require('specHelper');
var crypto = require('crypto');
var fs = require('fs');

describe("crypto Sign/Verify module", function() {
  it ('should allow signing and verification', function() {
    var message = "howdy, this is my message to sign";
    var privateKey = fs.readFileSync( 'src/test/javascript/key-rsa512-private.pem' );

    var sign = crypto.createSign('RSA-SHA256');
    sign.write( message );

    var signature = sign.sign(privateKey );

    var publicKey  = fs.readFileSync( 'src/test/javascript/key-rsa512-public.pem' );

    var verify = crypto.createVerify('RSA-SHA256');
    verify.write(message);

    expect( verify.verify(publicKey, signature ) ).toBe( true );
    expect( verify.verify(publicKey, new Buffer( [ 2, 3, 4, 5, 5 ])) ).toBe( false );

    verify = crypto.createVerify('RSA-SHA256');
    verify.write( "a completely different message" );
    expect( verify.verify(publicKey, signature ) ).toBe( false );
  });
});
