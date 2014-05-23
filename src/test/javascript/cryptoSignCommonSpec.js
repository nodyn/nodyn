var helper = require('specHelper');
var SignCommon = require('crypto/sign_common');

describe("crypto Sign-common module", function() {
  it('should be able to read a PEM key from a file', function(){
    try {
      System.err.println( "---" + process.execPath );
      var key = SignCommon.createKeyFromFile( 'src/test/javascript/key-rsa512-private.pem' );
      System.err.println( "key: " + key );
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
