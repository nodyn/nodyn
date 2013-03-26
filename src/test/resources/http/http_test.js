load('vertx_tests.js');
var http = require('http');
var test_headers = {
  'x-custom-header': 'A custom header'
}
var test_options = {
  port: 9999,
  path: '/some/path?with=a+query+string',
  headers: test_headers
}

function testCreateServerReturnsServer() {
  var server = http.createServer();
  vassert.assertTrue(server instanceof http.WebServer);
  server.close();
  vassert.testComplete();
}

function testServerListeningEvent() {
  var server = http.createServer();
  server.listen(test_options.port, function() {
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

// both request and response
function testMessageHeaders() {
  var server = http.createServer(function(request, response) {
    vassert.assertTrue(request.headersSent);
    vassert.assertEquals(test_headers['x-custom-header'], request.headers['x-custom-header']);
    var body = 'crunchy bacon';

    response.setHeader('Content-Type', 'text/plain');
    // TODO Figure out how to deal with headers having multiple values
    response.setHeader("Set-Cookie", ["type=ninja", "language=javascript"]);

    // send a non-standard response code
    // TODO: Make this work
    // response.writeHead(201, { 'Content-Length': body.length });
    response.end();
  });
  server.listen(test_options.port, function() {
    var request = http.request(test_options, function(response) {
      server.close();
//      vassert.assertEquals("201", response.statusCode.toString());
//      vassert.assertEquals('crunchy bacon'.length, response.headers['Content-Length']);
      vassert.assertEquals('text/plain', response.headers['Content-Type']);
      vassert.testComplete();
    });
    request.end();
  });
}

function testStatusCode() {
  var server = http.createServer(function(request, response) {
    response.end();
  });
  server.listen(test_options.port, function() {
    var request = http.request(test_options, function(response) {
      server.close();
      vassert.assertEquals("200", response.statusCode.toString());
      vassert.testComplete();
    });
    request.end();
  });
}

function testUrl() {
  var server = http.createServer(function(request, response) {
    vassert.assertEquals('/some/path?with=a+query+string', request.url);
    response.end();
  });
  server.listen(test_options.port, function() {
    var request = http.request(test_options, function(response) {
      server.close();
      vassert.testComplete();
    });
    request.end();
  });
}

function testHttpVersion() {
  var server = http.createServer(function(request, response) {
    vassert.assertEquals('1.1', request.httpVersion);
    vassert.assertEquals('1',   request.httpMajorVersion);
    vassert.assertEquals('1',   request.httpMinorVersion);
    response.end();
  });
  server.listen(test_options.port, function() {
    var request = http.request(test_options, function(response) {
      server.close();
      vassert.testComplete();
    });
    request.end();
  });
}

function testRequestMethod() {
  var server = http.createServer(function(request, response) {
    vassert.assertEquals('GET', request.method);
    response.end();
  });
  server.listen(test_options.port, function() {
    var request = http.request(test_options, function(response) {
      server.close();
      vassert.testComplete();
    });
    request.end();
  });
}

function testServerRequestEventCalled() {
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
  server.listen(test_options.port, function() {
    var request = http.request(test_options, function(response) {
      vassert.assertNotNull(response);
      vassert.assertEquals(true, called);
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
  server.listen(test_options.port, function() {
    vassert.assertTrue(http.request(test_options) instanceof http.ClientRequest);
    vassert.testComplete();
  });
}

initTests(this);
