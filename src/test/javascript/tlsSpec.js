var helper = require('./specHelper');
var tls    = require('tls');
var fs     = require('fs');

describe('tls', function(){

  var serverKey;
  var serverCert;

  beforeEach( function() {
    helper.testComplete(false);
    serverKey  = fs.readFileSync( './keys/DSA/serverkey.pem');
    serverCert = fs.readFileSync( './keys/DSA/servercert.pem');
  })

  it( 'should allow creation of a server with key and cert', function() {
    var server = tls.createServer( {
      key: serverKey,
      passphrase: 'server',
      cert: serverCert,
    },
    function(connection) {
    })
  });

  it( 'should allow creation of a server that can listen with key and cert', function() {
    waitsFor(helper.testComplete, "server to be listening", 5000);
    var server = tls.createServer( {
      key: serverKey,
      passphrase: 'server',
      cert: serverCert,
    },
    function(connection) {
    })

    server.listen(8181, function() {
      server.close();
      helper.testComplete(true);
    });
  });

});