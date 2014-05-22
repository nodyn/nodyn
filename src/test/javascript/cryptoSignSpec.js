var helper = require('specHelper');
var crypto = require('crypto');

describe("crypto Sign/Verify module", function() {
  xit ('should allow signing', function() {
    try {
      var sign = crypto.createSign('RSA-SHA256');
      sign.write( "howd" );

      var privKey = "notakey";
      sign.sign(privKey);
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
