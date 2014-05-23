
var fs = require('fs');
var Base64 = require('nodyn/codec/base64');

var KeySpec = java.security.spec.X509EncodedKeySpec;
var KeyFactory = java.security.KeyFactory;

var StringReader = java.io.StringReader;
var PEMParser = org.bouncycastle.openssl.PEMParser;
var Converter = org.bouncycastle.openssl.jcajce.JcaPEMKeyConverter;


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
  var reader = new StringReader(pem.toString());
  var parser = new PEMParser( reader );
  var object = parser.readObject();
  var converter = new Converter();
  var pair = {};
  if ( object instanceof org.bouncycastle.asn1.x509.SubjectPublicKeyInfo ) {
    pair.public = converter.getPublicKey( object );
  } else if ( object instanceof org.bouncycastle.asn1.pkcs.PrivateKeyInfo ) {
    pair.private = converter.getPrivateKey( object );
  } else {
    pair = converter.getKeyPair( object );
  }

  return pair;
}

module.exports.SignatureTypes = SignatureTypes;
module.exports.createKeyFromFile = createKeyFromFile;
module.exports.createKeyFromString = createKeyFromString;
