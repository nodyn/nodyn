
var http = require('http');
http.createServer(function(req, res) {
  res.writeHead(200);
  res.end("this request was processed by: " + process.pid );
}).listen(8000);
