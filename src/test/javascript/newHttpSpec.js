
var helper = require('specHelper');

describe( "new httpServer", function() {
  it( "should allow callbacks", function() {
    try {
      var server = new io.nodyn.http.ServerWrap();
      server.setRequestListener(function(req,res){
        req.on('data', function(d) {
          System.err.println( "received: " + d );
        })
        req.on( 'end', function() {
          res.write( "howdy" );
          res.end();
        })
      });
      server.listen( 3000, "localhost", 100, function() { System.err.println( "listening" ); });
    } catch (err) {
      System.err.println( "error: " + err );
      this.fail(err);
      // err.printStackTrace();
    }
  });
} );
