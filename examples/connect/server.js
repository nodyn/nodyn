print = console.log;
var http    = require('http'),
    connect = require('connect'),
    port    = 3000;

var app = connect()
  .use(connect.logger('dev'))
  .use(connect.static('public'))
  .use(function(req, res){
    res.end('hello world\n');
  });

http.createServer(app).listen(port, function() {
  console.log( "listening on " + port );
});
