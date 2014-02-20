var util = require('util'), 
    http = require('http'), 
    connect = require('connect');

var app = connect()
  .use(function(req, res) {
    res.end("Hello from Connect on Nodyn!");
  });

http.createServer(app).listen(3000, function() {
  console.log('Listening on port 3000');
});

