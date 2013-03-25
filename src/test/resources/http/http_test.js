load('vertx_tests.js');
var http = require('http');

function testCreateServer() {
  var server = http.createServer();
  vassert.assertNotNull(server);
  vassert.testComplete();
}

function testCreateServerWithRequestListener() {
  var called = false;
  var server = http.createServer(function() {
    called = true;
  });
  server.emit('request');
  vassert.assertTrue(called);
  vassert.testComplete();
}

function testServerListeningEvent() {
  var listening = false;
  var server = http.createServer();
  server.listen(9000, function() {
    listening = true;
  });
  // give the server half a second to start listening
  vertx.setTimer(500, function() {
    vassert.assertTrue(listening);
    vassert.testComplete();
  });
}

initTests(this);
