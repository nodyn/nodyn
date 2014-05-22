
var fs = require('fs');
var Base64 = require('nodyn/codec/base64');

var KeySpec = java.security.spec.X509EncodedKeySpec;
var KeyFactory = java.security.KeyFactory;

var SignatureTypes = {};


SignatureTypes.get = function(algo) {
  algo = algo.toLowerCase();

  if ( algo == 'rsa-sha256' ) {
    return SignatureTypes.SHA256withRSA;
  }
}

SignatureTypes.SHA256withRSA = {
  algorithm: 'SHA256withRSA',
};

function createKeyFromFile(file) {
  return createKeyFromString( fs.readFileSync( file ) );
}

function createKeyFromString(pem) {
  pem = pem.toString();
  var lines = pem.split("\n");
  var body = '';
  for ( var i = 0 ; i < lines.length ; ++i ) {
    var line = lines[i];
    if ( ! ( ( line.indexOf( "---" ) == 0 )|| line == '' ) ) {
      body += line;
    }
  }
  var buffer = Base64.decode( body );

  for ( var i = 0 ; i < buffer.length ; ++i ) {
    System.err.println( i + ": " + buffer[i] );
  }

  var keySpec = new KeySpec(buffer.delegate.bytes);

  return KeyFactory.getInstance('RSA').generatePrivate( keySpec );

}

module.exports.SignatureTypes = SignatureTypes;
module.exports.createKeyFromFile = createKeyFromFile;
module.exports.createKeyFromString = createKeyFromString;
