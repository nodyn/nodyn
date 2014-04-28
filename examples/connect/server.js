var http = require('http'), 
    app  = require('app'),
    port = 3000;

var server = http.createServer(app).listen(port, function() {
  console.log('Listening on port ' + port);
});

module.exports = server;
