var helper = require('./specHelper');
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
    testCipher( 'aes-128-cbc', 'bob',
     '6c cb c2 da 50 ee 0a 76 21 89 db a6 b2 68 8a 99'
    );
  } );

  it( "should produce the same bytes as node.js for AES-128-ECB", function() {
    testCipher( 'aes-128-ecb', 'bob',
     'ef a8 54 98 60 22 e7 e6 b3 ed 07 49 06 70 6b 5e'
    );
  });

  it( "should produce the same bytes as node.js for AES-192-CBC", function() {
    testCipher( 'aes-192-cbc', 'bob',
      '18 ed 20 9a 4c c8 9e 98 50 7b 69 06 03 f7 04 05'
    );
  } );

  it( "should produce the same bytes as node.js for AES-192-ECB", function() {
    testCipher( 'aes-192-ecb', 'bob',
      'd1 ef 14 b1 fc 0a 19 55 df 68 bd d4 f4 14 85 65'
    );
  } );

  it( "should produce the same bytes as node.js for AES-192-CBC", function() {
    testCipher( 'aes-256-cbc', 'bob',
      'e8 d9 72 a6 0e ae 6c 2e 33 c2 c3 7b 89 03 a4 48'
    );
  } );

  it( "should produce the same bytes as node.js for AES-192-ECB", function() {
    testCipher( 'aes-256-ecb', 'bob',
      'b5 34 54 89 1b a9 04 eb 19 c3 6f 08 fb ba f8 c9'
    );
  } );

  it( "should produce the same bytes as node.js for bf-cbc", function() {
    testCipher( 'bf-cbc', 'bob',
      'a9 fc 35 fa e8 c1 05 df'
    );
  } );

  it( "should produce the same bytes as node.js for bf-ecb", function() {
    testCipher( 'bf-ecb', 'bob',
      '1a ff 55 a0 9a c3 7f c3'
    );
  } );

  it( "should produce the same bytes as node.js for camellia-128-cbc", function() {
    testCipher( 'camellia-128-cbc', 'bob',
      'ca 5a be 29 b7 16 c2 18 ee 6c f7 dc 76 11 1b a3'
    );
  } );

  it( "should produce the same bytes as node.js for camellia-128-ecb", function() {
    testCipher( 'camellia-128-ecb', 'bob',
      '49 26 bb d8 2f 25 f3 82 43 72 fb 04 28 c8 87 05'
    );
  } );

  it( "should produce the same bytes as node.js for camellia-192-cbc", function() {
    testCipher( 'camellia-192-cbc', 'bob',
      'fb 84 75 be 36 cd af a2 4b d6 0c bc 19 44 66 49'
    );
  } );

  it( "should produce the same bytes as node.js for camellia-192-ecb", function() {
    testCipher( 'camellia-192-ecb', 'bob',
      '91 73 f3 50 af a9 4d 8b 44 f0 7b 69 0f 9f 41 4e'
    );
  } );

  it( "should produce the same bytes as node.js for camellia-256-cbc", function() {
    testCipher( 'camellia-256-cbc', 'bob',
      'd5 20 97 9d b0 7c 7a 85 6b d8 0d 1f 5b 04 4b 6b'
    );
  } );

  it( "should produce the same bytes as node.js for camellia-256-ecb", function() {
    testCipher( 'camellia-256-ecb', 'bob',
      'c7 1e c3 92 99 ed d1 91 6f c4 99 1a a5 d8 59 22'
    );
  } );



  it( "should enumerate supported cipher types", function() {
    var types = crypto.getCiphers();
    expect( types ).toContain( "des" );
    expect( types ).toContain( "aes-128-cbc" );
  })

  function testCipher(name, plaintext, expected) {
    var cipher = crypto.createCipher( name, 'tacos' );
    cipher.write( plaintext );
    var f = cipher.final();

    var bytes = expected.split(' ' );

    for ( i = 0 ; i < bytes.length ; ++i ) {
      var left = f[i];
      var right = parseInt( bytes[i], 16 );
      expect( f[i] ).toBe( parseInt( "0x" + bytes[i] ) );
    }

    var decipher = crypto.createDecipher( name, 'tacos' );
    decipher.write( f );
    f = decipher.final();
    expect( f.toString() ).toBe( plaintext );

  }

});

