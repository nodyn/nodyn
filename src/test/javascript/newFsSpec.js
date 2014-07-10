
var helper = require('specHelper');

var blocking = require('nodyn/blocking');
var fs = require('fs');

describe("fs module", function() {

  it('should handle blocky stuff', function() {
    try {
      var cb = function(a,b,c) {
        System.err.println( "---" );
        System.err.println( "callback on " + java.lang.Thread.currentThread() );
        System.err.println( "CALLBACK RESULT: " + this + " // " + a + ", " + b + ", " + c );
        System.err.println( "---" );
      }.bind( 'MEME');

      blocking.submit( function() {
        System.err.println( "action on " + java.lang.Thread.currentThread() );
        cb( "foo" );
        process.nextTick( function() {
          cb( "tacos", "cheese", 42 );
        })
      } );
    } catch (err) {
      System.err.println( "----------> " + err );
      err.printStackTrace();
    }
  });

} );