
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

module.exports.SignatureTypes = SignatureTypes;