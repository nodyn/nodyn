
module.exports.IncomingMessage = require('_http_incoming').IncomingMessage;

var server = require('_http_server');
module.exports.ServerResponse = server.ServerResponse;
module.exports.STATUS_CODES = server.STATUS_CODES;

var client = require('_http_client');
var ClientRequest = exports.ClientRequest = client.ClientRequest;

module.exports.request = client.request;

module.exports.get = function(options, cb) {
  var req = exports.request(options, cb);
  req.end();
  return req;
};

var Server = exports.Server = server.Server;

module.exports.createServer = function(requestListener) {
  return new Server(requestListener);
};

module.exports.createClient = function() {
  // This is deprecated. Use http.request instead
  console.log("http.createClient is deprecated. Please use http.request instead");
};


