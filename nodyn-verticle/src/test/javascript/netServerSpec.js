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

/*
    testSocketReadWrite: function() {
      completedCallback = false;
      server = net.createServer();
      server.on('connection', function(socket) {
        socket.on('data', function(buffer) {
          vassert.assertEquals('object', typeof buffer);
          vassert.assertEquals("crunchy bacon", buffer.toString());
          socket.write('with chocolate', function() {
            completedCallback = true;
          });
        });
      });
      server.listen(8800, function() {
        socket = net.connect(8800, function() {
          socket.write("crunchy bacon");
          socket.on('data', function(buffer) {
            vassert.assertEquals('with chocolate', buffer.toString());
            vassert.assertEquals(true, completedCallback);
            socket.destroy();
            server.close();
            vassert.testComplete();
          });
        });
      });
    },
    */

});
