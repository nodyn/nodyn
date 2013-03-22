load('vertx_tests.js');
var http = require('http');

function testCreateServer() {
  var server = http.createServer();
  vassert.assertNotNull(server);
  vassert.testComplete();
}

function testCreateServerRequestListener() {
  var called = false;
  var server =  http.createServer(function() {
    called = true;
  });
  server.emit('request');
  vassert.assertTrue(called);
  vassert.testComplete();
}

initTests(this);
