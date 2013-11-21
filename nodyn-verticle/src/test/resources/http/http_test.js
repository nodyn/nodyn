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

var HttpTests = {
  testCreateServerReturnsServer: function() {
    vassert.assertTrue(http.createServer() instanceof http.Server);
    vassert.testComplete();
  },

  testServerListeningEvent: function() {
    var server = http.createServer();
    server.listen(test_options.port, function() {
      server.close(function() {
        vassert.testComplete();
      });
    });
  },

  testCreateServerWithRequestListener: function() {
    var server = http.createServer(function() {
      // getting here means it worked
      vassert.testComplete();
    });
    // simulate a request event
    server.emit('request');
  },

  testRequestNoCallback: function() {
    var server = http.createServer(function(request, response) {
      request.on('data', function(data) {
        vassert.assertEquals('crispy bacon', data.toString());
        server.close(function() {
          vassert.testComplete();
        });
      });
      response.end();
    });
    test_options.method = 'POST';
    server.listen(test_options.port, function() {
      request = http.request(test_options);
      request.end('crispy bacon');
    });
  },

  testServerResponseWrite: function() {
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
          server.close(function() {
            vassert.testComplete();
          });
        });
      });
      request.end();
    });
  },

  testServerResponseWriteEnd: function() {
    var server = http.createServer(function(request, response) {
      vassert.assertEquals(false, response.headersSent);
      response.end('crunchy bacon');
      vassert.assertEquals(true, response.headersSent);
    });
    server.listen(test_options.port, function() {
      var request = http.request(test_options, function(response) {
        response.on('data', function(message) {
          vassert.assertEquals('crunchy bacon', message);
          server.close(function() {
            vassert.testComplete();
          });
        });
      });
      request.end();
    });
  },

  // both request and response
  testMessageHeaders: function() {
    var server = http.createServer(function(request, response) {
      vassert.assertEquals(test_headers['x-custom-header'], request.headers['x-custom-header']);
      var body = 'crunchy bacon';

      response.writeHead(201, { 'Content-Length': body.length });
      vassert.assertEquals(body.length.toString(), response.getHeader('Content-Length'));
      vassert.assertTrue(response.headersSent);

      response.setHeader('Content-Type', 'text/plain');
      vassert.assertEquals('text/plain', response.getHeader('Content-Type'));

      response.removeHeader('x-something-else');
      vassert.assertEquals(undefined, response.getHeader('x-something-else'));
      response.setHeader("Set-Cookie", ["type=ninja", "language=javascript"]);
      response.end();
    });
    server.listen(test_options.port, function() {
      var request = http.request(test_options, function(response) {
        vassert.assertEquals("201", response.statusCode.toString());
        vassert.assertEquals('text/plain', response.headers['Content-Type']);
        vassert.assertNotNull(response.headers['Date']);
        vassert.assertTrue(response.headers['Date'] != undefined);
        vassert.assertEquals('type=ninja,language=javascript', response.headers['Set-Cookie']);
        server.close(function() {
          vassert.testComplete();
        });
      });
      request.end();
    });
  },

  testTrailers: function() {
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
          server.close(function() {
            vassert.testComplete();
          });
        });
      });
      request.end();
    });
  },

  testMessageEncoding: function() {
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
          server.close(function() {
            vassert.assertEquals(expected, result);
            vassert.testComplete();
          });
        });
      }).end(expected);
    });
  },

  testPauseAndResume: function() {
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
            vassert.assertEquals(expectedServer, resultServer);
            vassert.assertEquals(expectedClient, resultClient);
            vassert.testComplete();
          });
        }, 100);
      });
      req.end(expectedServer);
    });
  },

  testStatusCode: function() {
    var server = http.createServer(function(request, response) {
      response.end("OK");
    });
    server.listen(test_options.port, function() {
      var request = http.request(test_options, function(response) {
        vassert.assertEquals("200", response.statusCode.toString());
        vassert.testComplete();
      });
      request.end();
    });
  },

  testUrl: function() {
    var server = http.createServer(function(request, response) {
      vassert.assertEquals('/some/path?with=a+query+string', request.url);
      response.end();
    });
    server.listen(test_options.port, function() {
      var request = http.request(test_options, function(response) {
        vassert.testComplete();
      });
      request.end();
    });
  },

  testHttpVersion: function() {
    var server = http.createServer(function(request, response) {
      vassert.assertEquals('1.1', request.httpVersion);
      vassert.assertEquals(1,   request.httpMajorVersion);
      vassert.assertEquals(1,   request.httpMinorVersion);
      response.end();
      vassert.testComplete();
    });
    server.listen(test_options.port, function() {
      var request = http.request(test_options);
      request.end();
    });
  },

  testRequestWrite: function() {
    var server = http.createServer(function(request, response) {
      request.on('data', function(data) {
        vassert.assertEquals("cheese muffins", data.toString());
        vassert.testComplete();
      });
      response.end();
    });
    server.listen(test_options.port, function() {
      var request = http.request(test_options, function() {});
      request.write("cheese muffins");
      request.end();
    });
  },

  testRequestMethod: function() {
    var server = http.createServer(function(request, response) {
      vassert.assertEquals('HEAD', request.method);
      response.end();
    });
    server.listen(test_options.port, function() {
      test_options.method = 'HEAD';
      http.request(test_options, function() {
        vassert.testComplete();
      }).end();
    });
  },

  testGetMethod: function() {
    var server = http.createServer(function(request, response) {
      vassert.assertEquals('GET', request.method);
      response.end();
      vassert.testComplete();
    });
    server.listen(test_options.port, function() {
      test_options.method = null;
      http.get(test_options);
    });
  },

  testRequestSetTimeout: function() {
    var server = http.createServer(function(request, response) {
      // do nothing - we want the connection to timeout
    });
    server.listen(test_options.port, function() {
      var request = http.request(test_options);
      request.setTimeout(10, function() {
        server.close();
        vassert.testComplete();
      });
    });
  },

  testServerRequestEventCalled: function() {
    var called = false;
    var server = http.createServer(function(request, response) {
      // node.js request listener
      // called when a 'request' event is emitted
      called = true;
      vassert.assertTrue(request instanceof http.IncomingMessage);
      vassert.assertTrue(response instanceof http.ServerResponse);
      response.statusCode = 200;
      response.end();
      server.close();
    });
    server.listen(test_options.port, function() {
      var request = http.request(test_options, function(response) {
        vassert.assertNotNull(response);
        vassert.assertEquals(true, called);
        vassert.testComplete();
      });
      request.end();
    });
  },

  testServerClose: function() {
    http.createServer().close(function() {
      vassert.testComplete();
    });
  },

  testServerTimeoutDefault: function() {
    var server = http.createServer();
    vassert.assertEquals(120000, server.timeout);
    vassert.testComplete();
  },

  testServerSetTimeout: function() {
    var timedOut = false;
    http.createServer().setTimeout(10, function(sock) {
      timedOut = true;
      sock.close();
    });
    timer.setTimer(100, function() {
      vassert.assertEquals(true, timedOut);
      vassert.testComplete();
    });
  },

  testServerCloseEvent: function() {
    var closed = false;
    var server = http.createServer();
    server.on('close', function() {
      closed = true;
    });
    server.close(function() {
      vassert.assertEquals(true, closed);
      vassert.testComplete();
    });
  },

  testCheckContinueEvent: function() {
    var server = http.createServer();
    server.on('checkContinue', function(request, response) {
      response.writeContinue();
      response.end();
      server.close();
    });
    server.listen(test_options.port, function() {
      var headers = {
        'Expect': '100-Continue'
      }
      test_options.headers = headers;
      var request = http.request(test_options, function(response) {});
      request.on('continue', function() {
        vassert.testComplete();
      });
      request.end();
    });
  },

  testConnectEventFired: function() {
    var server = http.createServer();
    server.on('request', function(request, response) {
      vassert.fail("CONNECT requests should not issue 'request' events");
      vassert.testComplete();
    });
    server.on('connect', function(request, clientSock, head) {
      vassert.assertTrue(clientSock !== null);
      vassert.assertTrue(clientSock !== undefined);
      vassert.assertTrue(head !== null);
      vassert.assertTrue(head !== undefined);
      clientSock.write('HTTP/1.1 200 Connection Established\r\n' +
                       'Proxy-agent: Nodyn-Proxy\r\n' +
                       '\r\n');
      clientSock.on('data', function(buffer) {
        vassert.assertEquals('Bonjour', buffer.toString());
        clientSock.write('Au revoir');
      });
      clientSock.end();
    });
    server.listen(test_options.port, function() {
      test_options.method = 'CONNECT';
      var request = http.request(test_options, function() {
        vassert.fail("CONNECT requests should not emit 'response' events");
      });
      request.on('connect', function(res, socket, head) {
        vassert.assertTrue(socket !== null);
        vassert.assertTrue(socket !== undefined);
        vassert.assertTrue(head !== null);
        vassert.assertTrue(head !== undefined);
        socket.write('Bonjour');
        socket.on('data', function(buffer) {
          vassert.assertEquals('Au revoir', buffer.toString());
          server.close();
          vassert.testComplete();
        });
      });
      request.end();
    });
  },

  testConnectionUpgrade: function() {
    var server = http.createServer(function(req, resp) {
      resp.writeHead(200, {'Content-Type': 'text/plain'});
      resp.end('later!');
    });

    server.on('upgrade', function(req, socket, head) {
      vassert.assertEquals('Upgrade', req.headers['Connection']);
      socket.write('HTTP/1.1 101 Web Socket Protocol Handshake\r\n' +
                   'Upgrade: WebSocket\r\n' +
                    'Connection: Upgrade\r\n' +
                    '\r\n');

      socket.write('fajitas');
    });

    server.listen(test_options.port, function() {
      test_options.headers = {
        'Connection': 'Upgrade',
        'Upgrade': 'websocket' }
      var request = http.request(test_options);
      request.end();

      request.on('upgrade', function(resp, socket, head) {
        vassert.assertEquals('Upgrade', resp.headers['Connection']);

        //  TODO: pending https://github.com/vert-x/vert.x/issues/610
        //socket.on('data', function(buffer) {
        //  vassert.assertEquals('object', typeof buffer);
        //  vassert.assertEquals("fajitas", buffer.toString());
        //  socket.destroy();
          server.close();
          vassert.testComplete();
        //});
      });
    });
    
  },

  testServerMaxHeadersCountDefaultValue: function() {
    var server = http.createServer();
    vassert.assertEquals(1000, server.maxHeadersCount);
    server.maxHeadersCount = 500;
    vassert.assertEquals(500, server.maxHeadersCount);
    vassert.testComplete();
  },

  testServerResponseHeadersSent: function() {
    var server = http.createServer(function(request, response) {
      vassert.assertEquals(false, response.headersSent);
      response.writeHead(201);
      vassert.assertEquals(true, response.headersSent);
      response.end();
      server.close();
    });
    server.listen(test_options.port, function() {
      var request = http.request(test_options, function(response) {
        vassert.testComplete();
      });
      request.end();
    });
  },

  testRequestReturnsClientRequest: function() {
    var server = http.createServer();
    server.listen(test_options.port, function() {
      vassert.assertTrue(http.request(test_options) instanceof http.ClientRequest);
      vassert.testComplete();
    });
  }
}
vertxTest.startTests(HttpTests);
