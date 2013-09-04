var net       = require('net');
var timer     = require('vertx/timer');
var vertxTest = require('vertx_tests');
var vassert   = vertxTest.vassert;

var NetTests = {
  testNetFunctionsExist: function() {
    vassert.assertEquals('function', typeof(net.Server));
    vassert.assertEquals('function', typeof(net.Socket));
    vassert.assertEquals('function', typeof(net.createServer));
    vassert.assertEquals('function', typeof(net.connect));
    vassert.assertEquals('function', typeof(net.createConnection));
    vassert.testComplete();
  },

  testServerListeningEvent: function() {
    listening = false;
    server = net.createServer();
    server.listen(8800, function() {
      server.close();
      vassert.testComplete();
    });
  },

  testServerClose: function() {
    server = net.createServer();
    server.on('close', function(e) {
      vassert.testComplete();
    });
    server.listen(8800, function() {
      server.close();
    });
  },

  testServerCloseWithCallback: function() {
    server = net.createServer();
    server.listen(8800, function() {
      server.close(function() {
        vassert.testComplete();
      });
    });
  },

  testConnect: function() {
    server = net.createServer();
    server.listen(8800, function() { 
      net.connect(8800, function() {
        server.close();
        vassert.testComplete();
      });
    });
  },

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

  testSocketTimeout: function() {
    server = net.createServer();
    server.on('connection', function(socket) { 
      socket.setTimeout(10, function() {
        socket.destroy();
        server.close();
        vassert.testComplete();
      });
    });
    server.listen(8800, function() {
      socket = net.connect(8800);
    });
  },

  testSocketTimeoutCanceled: function() {
    server = net.createServer();
    server.on('connection', function(socket) { 
      socket.setTimeout(300, function() {
        vassert.fail("Should not have timed out");
      });
      socket.setTimeout(0); // cancels the timeout we just set
    });
    server.listen(8800, function() {
      socket = net.connect(8800, function() {
        timer.setTimer(500, function() {
          server.close();
          vassert.testComplete();
        });
      });
    });
  },

  testSocketRemoteAddress: function() {
    server = net.createServer();
    server.listen(8800, function() {
      net.connect(8800, function(socket) {
          vassert.assertEquals('127.0.0.1', socket.remoteAddress);
          vassert.assertTrue(8800 == socket.remotePort);
          socket.destroy();
          server.close();
          vassert.testComplete();
      });
    });
  },

  testServerAddress: function() {
    server = net.createServer();
    server.listen(8800, function() {
      net.connect(8800, function(socket) {
        address = server.address();
        vassert.assertTrue(8800 == address.port);
        vassert.assertEquals("0.0.0.0", address.address);
        vassert.assertEquals("IPv4", address.family);
        vassert.testComplete();
      });
    });
  }
}

vertxTest.startTests(NetTests);
