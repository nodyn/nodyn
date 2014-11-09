var helper = require('./specHelper');
var tls    = require('tls');
var fs     = require('fs');

describe('tls', function(){

  var serverKey;
  var serverCert;

  beforeEach( function() {
    helper.testComplete(false);
    serverKey  = fs.readFileSync( './keys/RSA/server-key.pem');
    serverCert = fs.readFileSync( './keys/RSA/server-cert.pem');

    clientKey  = fs.readFileSync( './keys/RSA/client-key.pem' );
    clientCert = fs.readFileSync( './keys/RSA/client-cert.pem' );
  })

  it( 'should allow creation of a server with key and cert', function() {
    var server = tls.createServer( {
      key: serverKey,
      passphrase: 'iamserver',
      cert: serverCert,
    },
    function(connection) {
    })
  });

  it( 'should allow creation of a server that can listen with key and cert', function() {
    waitsFor(helper.testComplete, "server to be listening", 5000);
    var server = tls.createServer( {
      key: serverKey,
      passphrase: 'iamserver',
      cert: serverCert,
    },
    function(connection) {
    })

    server.listen(8181, function() {
      server.close();
      helper.testComplete(true);
    });
  });

  it ('should allow a secure client connection', function() {
    waitsFor(helper.testComplete, "server to receive connection", 5000);
    var server = tls.createServer( {
      key: serverKey,
      passphrase: 'iamserver',
      cert: serverCert
    }, function(connection) {
      expect( connection.getPeerCertificate() ).toBe( null );
      connection.on( 'data', function(b) {
        expect( b.toString() ).toBe( "howdy" );
        connection.destroy();
        server.close( function() {
          helper.testComplete(true);
        });
      })
    });
    server.on('clientError', function(err) {
      console.log( 'client error: ' + err );
    })

    server.listen( 8181, function() {
      var client = tls.connect( 8181, { ca: [ serverCert ] }, function() {
        expect( client.getPeerCertificate() ).not.toBe( null );
        client.write( "howdy" );
      })
    })
  });

  it ('should allow a secure authenticated client connection', function() {
    waitsFor(helper.testComplete, "server to receive connection", 5000);
    var server = tls.createServer( {
      key: serverKey,
      passphrase: 'iamserver',
      cert: serverCert,
      requestCert: true,
      rejectUnauthorized: true,
      ca: [ clientCert ]
    }, function(connection) {
      expect( connection.getPeerCertificate() ).not.toBe( null );
      connection.on( 'data', function(b) {
        expect( b.toString() ).toBe( "howdy" );
        connection.destroy();
        server.close( function() {
          helper.testComplete(true);
        });
      })
    });
    server.on('clientError', function(err) {
      console.log( 'client error: ' + err );
    })

    server.listen( 8181, function() {
      var client = tls.connect( 8181, {
          ca: [ serverCert ],
          key: clientKey,
          passphrase: 'iamclient',
          cert: clientCert
        }, function() {
        expect( client.getPeerCertificate() ).not.toBe( null );
        client.write( "howdy" );
      })
    })
  });

});
