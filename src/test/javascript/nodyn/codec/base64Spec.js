require('../../specHelper.js' )
var Base64 = require('nodyn/codec/base64');
var Buffer = require('buffer').Buffer;

describe( "base64", function() {
  it ( 'should encode 3 bytes correctly', function() {
    expect( Base64.encode( 't' ) ).toBe( 'dA==' );
  })

  it ( 'should encode 3 bytes correctly', function() {
    expect( Base64.encode( 'Man' ) ).toBe( 'TWFu' );
  });

  it ( 'should encode many bytes correctly', function() {
    expect( Base64.encode( 'tacosarecool' ) ).toBe( 'dGFjb3NhcmVjb29s' )
  });

  it ( "should encode the same as node", function() {
    var buf = new Buffer( [
        0x74, 0x40, 0x2c, 0x87, 0x10, 0xd5, 0x10, 0x72, 0x09, 0xee, 0x55, 0x4e, 0x2e, 0x11, 0xbc, 0xf7
    ]);

    expect( Base64.encode( buf ) ).toBe('dEAshxDVEHIJ7lVOLhG89w==')
  });

  it ( 'should handle edge-cases', function() {
    expect( Base64.encode( new Buffer('abc') ) ).toBe('YWJj' );
    expect( Base64.encode( new Buffer('abcd') ) ).toBe('YWJjZA==' );
    expect( Base64.encode( new Buffer('abcde') ) ).toBe( 'YWJjZGU=' );
    expect( Base64.encode( new Buffer('abcdef') ) ).toBe( 'YWJjZGVm' );
  } );

  it ( 'should be able to decode', function() {
    [ 't',
      'Man',
      'tacosarecool',
      'whatevergoesinShouldComeOut=='
     ].forEach( function(v) {
      result = Base64.decode( Base64.encode( v ) );
      expect( result.toString() ).toBe( v );
      //System.err.println( result.toString() );
    });
  });

});

