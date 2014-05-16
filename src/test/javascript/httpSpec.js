var helper = require('specHelper');
var http      = require('http');
var timer     = require('vertx/timer');

var test_headers, test_options;

describe('http', function(){
  beforeEach(function() {
    helper.testComplete(false);
    test_headers = {
      'x-custom-header': 'A custom header'
    };
    test_options = {
      port: 9999,
      path: '/some/path?with=a+query+string',
      headers: test_headers
    };
  });

  it('createServer should return a Server', function(done) {
    expect(http.createServer() instanceof http.Server).toBeTruthy();
    helper.testComplete(true);
  });

  it('should fire a listening event', function() {
    waitsFor(helper.testComplete, "waiting for .listen(handler) to fire", 5);
    var server = http.createServer();
    server.listen(test_options.port, function() {
      server.close(function() { helper.testComplete(true); });
    });
  });

  it('should fire a request event', function() {
    waitsFor(helper.testComplete, "waiting for request event to fire", 5);
    var server = http.createServer(function() {
      // getting here means it worked
      server.close(function() { helper.testComplete(true); });
    });
    // simulate a request event
    server.emit('request');
  });

  it('should be able to request with no callback', function() {
    waitsFor(helper.testComplete, "waiting for http request", 5);
    var server = http.createServer(function(request, response) {
      request.on('data', function(data) {
        expect('crispy bacon').toBe(data.toString());
        response.end();
        server.on('close', function() { helper.testComplete(true); });
        server.close();
      });
    });
    test_options.method = 'POST';
    server.listen(test_options.port, function() {
      var request = http.request(test_options);
      request.end('crispy bacon');
    });
  });

  it('should response.write', function() {
    waitsFor(helper.testComplete, "waiting for http response.write", 5);
    var server = http.createServer(function(request, response) {
      expect(response.headersSent).toBe(false);
      response.write('crunchy bacon');
      expect(response.headersSent).toBe(true);
      response.end();
    });
    server.listen(test_options.port, function() {
      var request = http.request(test_options, function(response) {
        response.on('data', function(message) {
          expect('crunchy bacon').toBe(message);
          server.close(function() { helper.testComplete(true); });
        });
      });
      request.end();
    });
  });

  it('should response.write end', function() {
    waitsFor(helper.testComplete, "waiting for http response.end", 5);
    var server = http.createServer(function(request, response) {
      expect(response.headersSent).toBe(false);
      response.end('crunchy bacon');
      expect(response.headersSent).toBe(true);
    });
    server.listen(test_options.port, function() {
      var request = http.request(test_options, function(response) {
        response.on('data', function(message) {
          expect('crunchy bacon').toBe(message);
          server.close(function() { helper.testComplete(true); });
        });
      });
      request.end();
    });
  });
});

describe('http request and response', function() {
  beforeEach(function() {
    helper.testComplete(false);
    test_headers = {
      'x-custom-header': 'A custom header'
    };
    test_options = {
      port: 9999,
      path: '/some/path?with=a+query+string',
      headers: test_headers
    };
  });

  it('should have message headers', function() {
    waitsFor(helper.testComplete, "waiting for message headers test", 5);
    var server = http.createServer(function(request, response) {
      expect(test_headers['x-custom-header']).toBe(request.headers['x-custom-header']);
      var body = 'crunchy bacon';

      response.writeHead(201, { 'Content-Length': body.length });
      expect(body.length.toString()).toBe(response.getHeader('Content-Length'));
      expect(response.headersSent).toEqual(true);

      response.setHeader('Content-Type', 'text/plain');
      expect('text/plain').toBe(response.getHeader('Content-Type'));

      response.removeHeader('x-something-else');
      expect(response.getHeader('x-something-else')).toBe(undefined);
      response.setHeader("Set-Cookie", ["type=ninja", "language=javascript"]);
      response.end();
    });
    server.listen(test_options.port, function() {
      var request = http.request(test_options, function(response) {
        expect(response.statusCode).toBe(201);
        expect(response.headers['Content-Type']).toBe('text/plain');
        expect(response.headers.Date).not.toBeNull();
        expect(response.headers.Date).not.toBe(undefined);
        expect(response.headers['Set-Cookie']).toBe('type=ninja,language=javascript');
        server.close(function() { helper.testComplete(true); });
      });
      request.end();
    });
  });

  it('should be able to add trailers', function() {
    waitsFor(helper.testComplete, "waiting for http trailers test", 5);
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
        expect(response.headers['Content-Type']).toBe('text/plain');
        expect(response.headers.Trailers).toBe('X-Custom-Trailer');
        response.on('end', function() {
          expect(response.trailers['X-Custom-Trailer']).toBe('a trailer');
          server.close(function() { helper.testComplete(true); });
        });
      });
      request.end();
    });
  });

  it('should have message encoding', function() {
    var expected = 'This is a unicode text: سلام';
    var result = '';

    waitsFor(helper.testComplete, "waiting for http message encoding test", 5);
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
            expect(expected).toBe(result);
            helper.testComplete(true);
          });
        });
      }).end(expected);
    });
  });

  it('should pause and resume', function() {
    var expectedServer = 'Request Body from Client';
    var resultServer = '';
    var expectedClient = 'Response Body from Server';
    var resultClient = '';

    waitsFor(helper.testComplete, "waiting for http pause and resume test", 5);
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
            expect(expectedServer).toBe(resultServer);
            expect(expectedClient).toBe(resultClient);
            server.close(function() { helper.testComplete(true); });
          });
        }, 100);
      });
      req.end(expectedServer);
    });
  });

  it('should have a status code', function() {
    waitsFor(helper.testComplete, "waiting for http status code test", 5);
    var server = http.createServer(function(request, response) {
      response.end("OK");
    });
    server.listen(test_options.port, function() {
      var request = http.request(test_options, function(response) {
        expect(response.statusCode.toString()).toBe("200");
        server.close(function() { helper.testComplete(true); });
      });
      request.end();
    });
  });

  it('should return a request.url', function() {
    waitsFor(helper.testComplete, "waiting for http request.url test", 5);
    var server = http.createServer(function(request, response) {
      expect(request.url).toBe('/some/path?with=a+query+string');
      response.end();
    });
    server.listen(test_options.port, function() {
      var request = http.request(test_options, function(response) {
        server.close(function() { helper.testComplete(true); });
      });
      request.end();
    });
  });

  it('should have the HTTP version in the request', function() {
    waitsFor(helper.testComplete, "waiting for http version test", 5);
    var server = http.createServer(function(request, response) {
      expect(request.httpVersion).toBe('1.1');
      expect(request.httpMajorVersion).toEqual(1);
      expect(request.httpMinorVersion).toEqual(1);
      response.end();
    });
    server.listen(test_options.port, function() {
      http.request(test_options, function(){
        server.close(function() { helper.testComplete(true); });
      }).end();
    });
  });

  it('should request.write', function() {
    waitsFor(helper.testComplete, "waiting for .listen(handler) to fire", 5);
    var server = http.createServer(function(request, response) {
      request.on('data', function(data) {
        expect(data.toString()).toBe("cheese muffins");
        response.end();
        server.close(function() { helper.testComplete(true); });
      });
    });
    server.listen(test_options.port, function() {
      var request = http.request(test_options, function() {
      });
      request.write("cheese muffins");
      request.end('bye'); // TODO: This should not be necessary
                          // TODO: But if we don't write something
                          // TODO: Vert.x inexplicably throws NPE
    });
  });

  it('should have a request.method', function() {
    waitsFor(helper.testComplete, "waiting for .listen(handler) to fire", 5);
    var server = http.createServer(function(request, response) {
      expect(request.method).toBe('HEAD');
      response.end();
    });
    server.listen(test_options.port, function() {
      test_options.method = 'HEAD';
      http.request(test_options, function() {
        server.close(function() { helper.testComplete(true); });
      }).end();
    });
  });

  it('should have a GET method', function() {
    waitsFor(helper.testComplete, "waiting for .listen(handler) to fire", 5);
    var server = http.createServer(function(request, response) {
      expect(request.method).toBe('GET');
      response.end();
      server.close(function() { helper.testComplete(true); });
    });
    server.listen(test_options.port, function() {
      test_options.method = null;
      http.get(test_options);
    });
  });

  it('should have a request setTimeout', function() {
    waitsFor(helper.testComplete, "waiting for .listen(handler) to fire", 5);
    var server = http.createServer(function(request, response) {
      // do nothing - we want the connection to timeout
    });
    server.listen(test_options.port, function() {
      var request = http.request(test_options);
      request.setTimeout(10, function() {
        server.close(function() { helper.testComplete(true); });
      });
    });
  });

  it('should have a request event called', function() {
    waitsFor(helper.testComplete, "waiting for .listen(handler) to fire", 5);
    var called = false;
    var server = http.createServer(function(request, response) {
      // node.js request listener
      // called when a 'request' event is emitted
      called = true;
      expect(request instanceof http.IncomingMessage);
      expect(response instanceof http.ServerResponse);
      response.statusCode = 200;
      response.end();
    });
    server.listen(test_options.port, function() {
      var request = http.request(test_options, function(response) {
        expect(response).not.toBeNull();
        expect(called).toEqual(true);
        server.close(function() { helper.testComplete(true); });
      });
      request.end();
    });
  });

  it('should have a close', function() {
    waitsFor(helper.testComplete, "waiting for .listen(handler) to fire", 5);
    http.createServer().close(function() {
      helper.testComplete(true);
    });
  });

  it('should have a default timeout', function() {
    var server = http.createServer();
    expect(server.timeout).toEqual(120000);
    helper.testComplete(true);
  });

  it('should setTimeout', function() {
    var timedOut = false;
    waitsFor(helper.testComplete, "waiting for .listen(handler) to fire", 5);
    http.createServer().setTimeout(10, function(sock) {
      timedOut = true;
      sock.close();
    });
    timer.setTimer(100, function() {
      expect(timedOut).toEqual(true);
      helper.testComplete(true);
    });
  });

  it('should have a close event', function() {
    var closed = false;
    var server = http.createServer();

    waitsFor(helper.testComplete, "waiting for .listen(handler) to fire", 5);
    server.on('close', function() {
      closed = true;
    });
    server.close(function() {
      expect(closed).toEqual(true);
      helper.testComplete(true);
    });
  });

  it('should have a continue event', function() {
    var server = http.createServer();
    waitsFor(helper.testComplete, "waiting for .listen(handler) to fire", 5);
    server.on('checkContinue', function(request, response) {
      response.writeContinue();
      response.end();
    });
    server.listen(test_options.port, function() {
      var headers = {
        'Expect': '100-Continue'
      };
      test_options.headers = headers;
      var request = http.request(test_options, function(response) {});
      request.on('continue', function() {
        server.close();
        helper.testComplete(true);
      });
      request.end();
    });
  });

  it('should have a connect fired event', function() {
    var server = http.createServer();
    waitsFor(helper.testComplete, "waiting for .listen(handler) to fire", 5);
    server.on('request', function(request, response) {
        this.fail(Error("CONNECT requests should not issue 'request' events"));
      helper.testComplete(true);
    }.bind(this));
    server.on('connect', function(request, clientSock, head) {
      expect(clientSock !== null);
      expect(clientSock !== undefined);
      expect(head !== null);
      expect(head !== undefined);
      clientSock.write('HTTP/1.1 200 Connection Established\r\n' +
                       'Proxy-agent: Nodyn-Proxy\r\n' +
                       '\r\n');
      clientSock.on('data', function(buffer) {
        expect(buffer.toString()).toBe('Bonjour');
        clientSock.write('Au revoir');
        clientSock.end();
      });
    });
    server.listen(test_options.port, function() {
      test_options.method = 'CONNECT';
      var clientRequest = http.request(test_options, function() {
        fail(Error("CONNECT requests should not emit 'response' events"));
      }.bind(this));
      clientRequest.on('connect', function(res, socket, head) {
        expect(socket !== null);
        expect(socket !== undefined);
        expect(head !== null);
        expect(head !== undefined);
        socket.write('Bonjour');
        socket.on('data', function(buffer) {
          expect(buffer.toString()).toBe('Au revoir');
          server.close();
          helper.testComplete(true);
        });
      });
      clientRequest.end();
    });
  });

  it('should do a connection upgrade', function() {
    waitsFor(helper.testComplete, "waiting for .listen(handler) to fire", 5);
    var server = http.createServer(function(req, resp) {
      resp.writeHead(200, {'Content-Type': 'text/plain'});
      resp.end('later!');
    });

    server.on('upgrade', function(req, socket, head) {
      expect(req.headers.Connection).toBe('Upgrade');
      socket.write('HTTP/1.1 101 Web Socket Protocol Handshake\r\n' +
                   'Upgrade: WebSocket\r\n' +
                    'Connection: Upgrade\r\n' +
                    '\r\n');

      socket.write('fajitas');
    });

    server.listen(test_options.port, function() {
      test_options.headers = {
        'Connection': 'Upgrade',
        'Upgrade': 'websocket'
      };
      var request = http.request(test_options);
      request.end();

      request.on('upgrade', function(resp, socket, head) {
        expect(resp.headers.Connection).toBe('Upgrade');

        //  TODO: pending https://github.com/vert-x/vert.x/issues/610
        //socket.on('data', function(buffer) {
        //  vassert.assertEquals('object', typeof buffer);
        //  vassert.assertEquals("fajitas", buffer.toString());
        //  socket.destroy();
          server.close();
          helper.testComplete(true);
        //});
      });
    });
  });

  it('should have a Server Max Headers Count Default value', function() {
    var server = http.createServer();
    expect(server.maxHeadersCount).toEqual(1000);
    server.maxHeadersCount = 50000;
    expect(server.maxHeadersCount).toEqual(50000);
    helper.testComplete();
  });

  it('should send Response Headers', function() {
    waitsFor(helper.testComplete, "waiting for .listen(handler) to fire", 5);
    var server = http.createServer(function(request, response) {
      expect(response.headersSent).toEqual(false);
      response.writeHead(201);
      expect(response.headersSent).toEqual(true);
      response.end();
    });
    server.listen(test_options.port, function() {
      var request = http.request(test_options, function(response) {
        server.close();
        helper.testComplete(true);
      });
      request.end();
    });
  });

  it('should return a ClientRequest on a Request', function() {
    waitsFor(helper.testComplete, "waiting for .listen(handler) to fire", 5);
    var server = http.createServer(function(request, response) {
      response.writeHead(200);
      response.end();
    });
    server.listen(test_options.port, function() {
      var request = http.request(test_options, function(response) {
        server.close();
        helper.testComplete(true);
      });
      expect(request instanceof http.ClientRequest);
      request.end();
    });
  });
});
