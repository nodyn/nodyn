var helper = require('specHelper');
var net = require( "net-x" );

describe( "net.Server", function() {

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
  });

  it("should fire a 'close' event registered prior to close()", function() {
    server = net.createServer();
    server.on('close', function(e) {
      helper.testComplete(true);
    });
    server.listen(8800, function() {
      server.close();
    });
  });

  it("should fire a 'close' event on a callback passed to close()", function() {
    server = net.createServer();
    server.listen(8800, function() {
      server.close(function() {
        helper.testComplete(true);
      });
    });
  });

  it("should fire a 'connect' callback on client connection", function() {
    server = net.createServer();
    server.listen(8800, function() {
      net.connect(8800, function() {
        server.close();
        helper.testComplete(true);
      });
    });
  });


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
      socket = net.connect(8800, function() {
        socket.write("crunchy bacon");
        socket.on('data', function(buffer) {
          expect(buffer.toString()).toBe('with chocolate');
          expect(completedCallback).toBe(true);
          socket.destroy();
          server.close();
          helper.testComplete(true);
        });
      });
    });
  });

});
