require('../../specHelper.js' )
var Hex = require('nodyn/codec/hex');
var Buffer = require('buffer').Buffer;

describe( "hex encoding", function() {
  it ( 'should produce the same as node', function(){
    var b = new Buffer( 'tacos' );
    expect( b.toString('hex')).toBe( '7461636f73')
  });

  it ( 'should be able to decode', function() {
    [ 't',
      'Man',
      'tacosarecool',
      'whatevergoesinShouldComeOut=='
     ].forEach( function(v) {
      result = Hex.decode( Hex.encode( v ) );
      expect( result.toString() ).toBe( v );
    });
  });

});

