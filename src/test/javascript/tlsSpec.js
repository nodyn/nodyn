var helper = require('./specHelper');
var tls    = require('tls');
var fs     = require('fs');

describe('tls', function(){

  it( 'should allow creation of a server with key and cert', function() {
    var serverKey  = fs.readFileSync( './keys/dsa/serverkey.pem');
    var serverCert = fs.readFileSync( './keys/dsa/servercert.pem');
    var server = tls.createServer( {
      key: serverKey,
      passphrase: 'server',
      cert: serverCert,
    }, function(connection) {
    })
  });

});