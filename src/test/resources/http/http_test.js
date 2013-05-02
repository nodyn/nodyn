var vertxTest = require('vertx_tests');
var vassert   = vertxTest.vassert;

var http      = require('http');
var timer     = require('vertx/timer');

var test_headers = {
  'x-custom-header': 'A custom header'
}
var test_options = {
  port: 9999,
  path: '/some/path?with=a+query+string',
  headers: test_headers
}

var server = http.createServer();

function testCreateServerReturnsServer() {
  vassert.assertTrue(server instanceof http.Server);
  server.close();
  vassert.testComplete();
}

function testServerListeningEvent() {
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

function testRequestNoCallback() {
  var server = http.createServer(function(request, response) {
    request.on('data', function(data) {
      vassert.assertEquals('crispy bacon', data.toString());
      vassert.testComplete();
    });
    response.end();
  });
  test_options.method = 'POST';
  server.listen(test_options.port, function() {
    request = http.request(test_options);
    request.end('crispy bacon');
  });
}

function testServerResponseWrite() {
  var server = http.createServer(function(request, response) {
    vassert.assertEquals(false, response.headersSent);
    response.write('crunchy bacon');
    vassert.assertEquals(true, response.headersSent);
    response.end();
  });
  server.listen(test_options.port, function() {
    var request = http.request(test_options, function(response) {
      response.on('data', function(message) {
        vassert.assertEquals('crunchy bacon', message);
        server.close();
        vassert.testComplete();
      });
    });
    request.end();
  });
}

function testServerResponseWriteEnd() {
  var server = http.createServer(function(request, response) {
    vassert.assertEquals(false, response.headersSent);
    response.end('crunchy bacon');
    vassert.assertEquals(true, response.headersSent);
  });
  server.listen(test_options.port, function() {
    var request = http.request(test_options, function(response) {
      response.on('data', function(message) {
        vassert.assertEquals('crunchy bacon', message);
        server.close();
        vassert.testComplete();
      });
    });
    request.end();
  });
}

// both request and response
function testMessageHeaders() {
  var server = http.createServer(function(request, response) {
    vassert.assertTrue(request.headersSent);
    vassert.assertEquals(test_headers['x-custom-header'], request.headers['x-custom-header']);
    var body = 'crunchy bacon';

    // TODO: For some reason, vert.x hangs when sending Content-Length?
    // response.writeHead(201, { 'Content-Length': body.length });
    response.writeHead(201, { 'x-something-else': body.length });
    response.setHeader('Content-Type', 'text/plain');
    vassert.assertEquals('text/plain', response.getHeader('Content-Type'));
    vassert.assertEquals(body.length.toString(), response.getHeader('x-something-else'));
    response.removeHeader('x-something-else');
    vassert.assertEquals(undefined, response.getHeader('x-something-else'));
    // TODO Figure out how to deal with headers having multiple values
//    response.setHeader("Set-Cookie", ["type=ninja", "language=javascript"]);
    response.end();
  });
  server.listen(test_options.port, function() {
    var request = http.request(test_options, function(response) {
      server.close();
      vassert.assertEquals("201", response.statusCode.toString());
      vassert.assertEquals('text/plain', response.headers['Content-Type']);
      vassert.assertNotNull(response.headers['Date']);
      vassert.assertTrue(response.headers['Date'] != undefined);
      vassert.testComplete();
    });
    request.end();
  });
}

function testTrailers() {
  var server = http.createServer(function(request, response) {
    var body = 'crunchy bacon';
    response.writeHead(200, {'Content-Type': 'text/plain',
                              'Trailers': 'X-Custom-Trailer'});
    response.write(body);
    response.addTrailers({'X-Custom-Trailer': 'a trailer'});
    response.end();
  });
  server.listen(test_options.port, function() {
    var request = http.request(test_options, function(response) {
      vassert.assertEquals('text/plain', response.headers['Content-Type']);
      vassert.assertEquals('X-Custom-Trailer', response.headers['Trailers']);
      response.on('end', function() {
        vassert.assertEquals('a trailer', response.trailers['X-Custom-Trailer']);
        server.close();
        vassert.testComplete();
      });
    });
    request.end();
  });
}

function testMessageEncoding() {
  var expected = 'This is a unicode text: سلام';
  var result = '';

  var server = http.createServer(function(req, res) {
    req.setEncoding('utf8');
    req.on('data', function(chunk) {
      result += chunk;
    });
    res.writeHead(200);
    res.end('hello world\n');
  });

  server.listen(test_options.port, function() {
    test_options.method = 'POST';
    test_options.path = '/unicode/test';
    var request = http.request(test_options, function(res) {
      res.resume();
      res.on('end', function() {
        server.close();
        vassert.assertEquals(expected, result);
        vassert.testComplete();
      });
    }).end(expected);
  });
}

function testPauseAndResume() {
  var expectedServer = 'Request Body from Client';
  var resultServer = '';
  var expectedClient = 'Response Body from Server';
  var resultClient = '';

  var server = http.createServer(function(req, res) {
    req.pause();
    setTimeout(function() {
      req.resume();
      req.setEncoding('utf8');
      req.on('data', function(chunk) {
        resultServer += chunk;
      });
      req.on('end', function() {
        res.writeHead(200);
        res.end(expectedClient);
      });
    }, 100);
  });

  server.listen(test_options.port, function() {
    test_options.method = 'POST';
    var req = http.request(test_options, function(res) {
      res.pause();
      setTimeout(function() {
        res.resume();
        res.on('data', function(chunk) {
          resultClient += chunk;
        });
        res.on('end', function() {
          server.close();
          vassert.assertEquals(expectedServer, resultServer);
          vassert.assertEquals(expectedClient, resultClient);
          vassert.testComplete();
        });
      }, 100);
    });
    req.end(expectedServer);
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

function testRequestWrite() {
  var server = http.createServer(function(request, response) {
    request.on('data', function(data) {
      vassert.assertEquals("cheese muffins", data.toString());
      server.close();
      vassert.testComplete();
    });

    response.end();
  });
  server.listen(test_options.port, function() {
    var request = http.request(test_options, function() {});
    request.write("cheese muffins");
    request.end();
  });
}

function testRequestMethod() {
  var server = http.createServer(function(request, response) {
    vassert.assertEquals('HEAD', request.method);
    response.end();
  });
  server.listen(test_options.port, function() {
    test_options.method = 'HEAD';
    // TODO: This should not produce a stack
    // https://github.com/vert-x/vert.x/issues/569
    var request = http.request(test_options, function(response) {
      server.close();
      vassert.testComplete();
    });
    request.end();
  });
}

function testGetMethod() {
  var server = http.createServer(function(request, response) {
    vassert.assertEquals('GET', request.method);
    response.end();
  });
  server.listen(test_options.port, function() {
    test_options.method = null;
    http.get(test_options, function(response) {
      server.close();
      vassert.testComplete();
    });
  });
}

function testRequestSetTimeout() {
  var server = http.createServer(function(request, response) {
    // do nothing - we want the connection to timeout
  });
  server.listen(test_options.port, function() {
    var request = http.request(test_options);
    request.setTimeout(10, function() {
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
  vassert.assertEquals(120000, server.timeout);
  vassert.testComplete();
}

function testServerSetTimeout() {
  var timedOut = false;
  server.setTimeout(10, function(sock) {
    timedOut = true;
    sock.close();
  });
  timer.setTimer(100, function() {
    vassert.assertEquals(true, timedOut);
    vassert.testComplete();
  });
}

function testServerCloseEvent() {
  var closed = false;
  server.on('close', function() {
    closed = true;
  });
  server.close(function() {
    vassert.assertEquals(true, closed);
    vassert.testComplete();
  });
}

function testCheckContinueEvent() {
  var eventFired = false;
  server.on('checkContinue', function(request, response) {
    eventFired = true;
    response.writeContinue();
    response.end();
  });
  server.listen(test_options.port, function() {
    var headers = {
      'Expect': '100-Continue'
    }
    test_options.headers = headers;
    var request = http.request(test_options, function(response) {
      server.close();
      vassert.assertEquals(true, eventFired);
      test_options.headers = null;
      vassert.testComplete();
    });
    request.end();
  });
}

// TODO: Fix me
function DEFERREDtestConnectEventFired() {
  var eventFired = false;
  server.on('connect', function(request, socket, head) {
    vassert.testComplete();
    server.close();
  });
  server.listen(test_options.port, function() {
    test_options.method = 'CONNECT';
    http.request(test_options).end();
  });
}

function testServerMaxHeadersCountDefaultValue() {
  vassert.assertEquals(1000, server.maxHeadersCount);
  server.maxHeadersCount = 500;
  vassert.assertEquals(500, server.maxHeadersCount);
  vassert.testComplete();
}

function testServerResponseHeadersSent() {
  var server = http.createServer(function(request, response) {
    vassert.assertTrue(request.headersSent);
    vassert.assertEquals(false, response.headersSent);
    response.writeHead(201);
    vassert.assertEquals(true, response.headersSent);
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

function testRequestReturnsClientRequest() {
  server.listen(test_options.port, function() {
    vassert.assertTrue(http.request(test_options) instanceof http.ClientRequest);
    vassert.testComplete();
  });
}

vertxTest.startTests(this);
