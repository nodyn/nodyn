load('vertx_tests.js');
var http = require('http');
var test_port = 9999;

function testCreateServerReturnsServer() {
  var server = http.createServer();
  vassert.assertTrue(server instanceof http.WebServer);
  server.close();
  vassert.testComplete();
}

function testServerListeningEvent() {
  var server = http.createServer();
  server.listen(test_port, function() {
    server.close();
    vassert.testComplete();
  });
}

function testCreateServerWithRequestListener() {
  var called = false;
  var server = http.createServer(function() {
    called = true;
  });
  // simulate a request event
  server.emit('request');
  server.close();
  vassert.assertTrue(called);
  vassert.testComplete();
}

function testServerRequestEvent() {
  var called = false;
  var server = http.createServer(function(request, response) {
    // node.js request listener
    // called when a 'request' event is emitted
    called = true;
    vassert.assertTrue(request instanceof http.IncomingMessage);
    vassert.assertTrue(response instanceof http.ServerResponse);
    response.statusCode = 200;
    response.end();
  });
  server.listen(test_port, function() {
    var request = http.request({port: test_port}, function(response) {
      vassert.assertNotNull(response);
      vassert.assertEquals(true, called);
      vassert.assertEquals("200", response.statusCode.toString());
      server.close();
      vassert.testComplete();
    });
    request.end();
  });
}

function testServerClose() {
  http.createServer().close(function() {
    vassert.testComplete();
  });
}

function testServerTimeoutDefault() {
  var server = http.createServer();
  vassert.assertEquals(120000, server.timeout);
  vassert.testComplete();
}

function testServerMaxHeadersCountDefaultValue() {
  var server = http.createServer();
  vassert.assertEquals(1000, server.maxHeadersCount);
  vassert.testComplete();
}

function testRequestReturnsClientRequest() {
  var server  = http.createServer();
  server.listen(test_port, function() {
    vassert.assertTrue(http.request({port: test_port}) instanceof http.ClientRequest);
    vassert.testComplete();
  });
}

initTests(this);
