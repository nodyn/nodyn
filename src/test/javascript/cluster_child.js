
var http = require('http');
var cluster = require('cluster');

console.log( "child: booting up" );

http.createServer(function(req, res) {
  console.log( "child: got request" );
  res.writeHead(200);
  res.end("this request was processed by: " + process.pid + " aka worker#" + cluster.worker.id );
  console.log( "child: finished request" );
}).listen(8000, function() {
  console.log("child: listening");
});
