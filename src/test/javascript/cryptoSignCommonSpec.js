var helper = require('specHelper');
var SignCommon = require('crypto/sign_common');

describe("crypto common module", function() {
  xit('should be able to read a PEM key from a file', function(){
    try {
      System.err.println( "---" + process.execPath );
      SignCommon.createKeyFromFile( 'src/test/javascript/key-rsa256-private.pem' );
    } catch (err) {
      if ( err.printStackTrace ) {
        err.printStackTrace();
      } else {
        System.err.println( err );
      }
      throw err;
    }
  });
});
