var helper = require('specHelper');
var crypto = require('crypto');

describe("crypto Cipher & Decipher module", function() {

  it( "should produce the same bytes as node.js for DES", function() {
    var cipher = crypto.createCipher( 'des', 'tacos' );
    cipher.write( "bob" );
    var f = cipher.final();
    // <2f a4 16 67 41 e0 37 8e>

    expect( f[0] ).toBe( 0x2F );
    expect( f[1] ).toBe( 0xA4 );
    expect( f[2] ).toBe( 0x16 );
    expect( f[3] ).toBe( 0x67 );
    expect( f[4] ).toBe( 0x41 );
    expect( f[5] ).toBe( 0xE0 );
    expect( f[6] ).toBe( 0x37 );
    expect( f[7] ).toBe( 0x8e );

    var decipher = crypto.createDecipher( 'des', 'tacos' );
    decipher.write( f );
    f = decipher.final();
    expect( f.toString() ).toBe( 'bob' );
  });

  it ("should produce the same bytes as node.js for DES and iv", function() {
    var cipher = crypto.createCipheriv( 'des', 'tacotaco', 'dogsdogs' );
    cipher.write("howdy");
    var f = cipher.final();
    //<60 b7 d3 bc 8c ec d3 41>
    expect( f[0] ).toBe( 0x60 );
    expect( f[1] ).toBe( 0xB7 );
    expect( f[2] ).toBe( 0xD3 );
    expect( f[3] ).toBe( 0xBC );
    expect( f[4] ).toBe( 0x8C );
    expect( f[5] ).toBe( 0xEC );
    expect( f[6] ).toBe( 0xD3 );
    expect( f[7] ).toBe( 0x41 );
  })

  it( "should produce the same bytes as node.js for AES-128-CBC", function() {
    var cipher = crypto.createCipher( 'aes-128-cbc', 'tacos' );
    cipher.write( "bob" );
    var f = cipher.final();
    // <6c cb c2 da 50 ee 0a 76 21 89 db a6 b2 68 8a 99>

    expect( f[0] ).toBe( 0x6c );
    expect( f[1] ).toBe( 0xcb );
    expect( f[2] ).toBe( 0xc2 );
    expect( f[3] ).toBe( 0xda );
    expect( f[4] ).toBe( 0x50 );
    expect( f[5] ).toBe( 0xee );
    expect( f[6] ).toBe( 0x0a );
    expect( f[7] ).toBe( 0x76 );
    expect( f[8] ).toBe( 0x21 );
    expect( f[9] ).toBe( 0x89 );
    expect( f[10] ).toBe( 0xdb );
    expect( f[11] ).toBe( 0xa6 );
    expect( f[12] ).toBe( 0xb2 );
    expect( f[13] ).toBe( 0x68 );
    expect( f[14] ).toBe( 0x8a );
    expect( f[15] ).toBe( 0x99 );


    var decipher = crypto.createDecipher( 'aes-128-cbc', 'tacos' );
    decipher.write( f );
    f = decipher.final();
    expect( f.toString() ).toBe( 'bob' );
  });

  it( "should enumerate supported cipher types", function() {
    var types = crypto.getCiphers();

    expect( types ).toContain( "des" );
    expect( types ).toContain( "aes-128-cbc" );
  })

});

