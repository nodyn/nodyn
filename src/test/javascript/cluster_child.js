
var http = require('http');
var cluster = require('cluster');

http.createServer(function(req, res) {
  res.writeHead(200);
  res.end("this request was processed by: " + process.pid + " aka worker#" + cluster.worker.id );
}).listen(8000);
