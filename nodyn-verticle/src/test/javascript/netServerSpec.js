var helper = require('specHelper');
var net = require( "net" );

describe( "net.Server", function() {

  beforeEach(function() {
    helper.testComplete(false);
  });

  it("should have all the correct functions defined", function() {
    expect(typeof net.Server).toBe('function');
    expect(typeof net.Socket).toBe('function');
    expect(typeof net.createServer).toBe('function');
    expect(typeof net.connect).toBe('function');
    expect(typeof net.createConnection).toBe('function');
    helper.testComplete(true);
  });

  it("should fire a 'listening' event", function() {
    server = net.createServer();
    server.listen(8800, function() {
      server.close();
      helper.testComplete(true);
    });
    waitsFor(helper.testComplete, "waiting for .listen(handler) to fire", 3);
  });

  it("should fire a 'close' event registered prior to close()", function() {
    server = net.createServer();
    server.on('close', function(e) {
      helper.testComplete(true);
    });
    server.listen(8800, function() {
      server.close();
    });
    waitsFor(helper.testComplete, "waiting for .on(close) to fire", 3);

  });

  it("should fire a 'close' event on a callback passed to close()", function() {
    server = net.createServer();
    server.listen(8800, function() {
      server.close(function() {
        helper.testComplete(true);
      });
    });
    waitsFor(helper.testComplete, "waiting for close handler to fire", 3);
  });

  it("should fire a 'connect' callback on client connection", function() {
    server = net.createServer();
    server.listen(8800, function() {
      net.connect(8800, function(socket) {
        server.close();
        helper.testComplete(true);
      });
    });
    waitsFor(helper.testComplete, "waiting for connection handler to fire", 3);
  });
  /*


  it("should allow reading and writing from both client/server connections", function() {
    completedCallback = false;
    server = net.createServer();
    server.on('connection', function(socket) {
      socket.on('data', function(buffer) {
        expect(typeof buffer).toBe('object');
        expect(buffer.toString()).toBe('crunchy bacon');
        socket.write('with chocolate', function() {
          completedCallback = true;
        });
      });
    });
    server.listen(8800, function() {
      java.lang.System.err.println( "server is listening" );
      socket = net.connect(8800, function() {
        socket.write("crunchy bacon");
        socket.on('data', function(buffer) {
          java.lang.System.err.println( "client got data" );
          expect(buffer.toString()).toBe('with chocolate');
          expect(completedCallback).toBe(true);
          socket.destroy();
          server.close();
          java.lang.System.err.println( "client/server complete" );
          helper.testComplete(true);
        });
      });
    });
  });

  it("should support an idle socket timeout", function() {
    server = net.createServer();
    server.on('connection', function(socket) {
      socket.setTimeout(10, function() {
        java.lang.System.err.println( "timeout fired" );
        socket.destroy();
        server.close();
        helper.testComplete(true);
      });
      java.lang.System.err.println( "timeout set" );
    });
    server.listen(8800, function() {
      socket = net.connect(8800);
    });
  });

*/
});
