var net       = require('net');
var timer     = require('vertx/timer');
var vertxTest = require('vertx_tests');
var vassert   = vertxTest.vassert;

function testNetFunctionsExist() {
  vassert.assertEquals('function', typeof(net.Server));
  vassert.assertEquals('function', typeof(net.Socket));
  vassert.assertEquals('function', typeof(net.createServer));
  vassert.assertEquals('function', typeof(net.connect));
  vassert.assertEquals('function', typeof(net.createConnection));
  vassert.testComplete();
}

function testServerListeningEvent() {
  listening = false;
  server = net.createServer();
  server.listen(8800, function() {
    server.close();
    vassert.testComplete();
  });
}

function testServerClose() {
  server = net.createServer();
  server.on('close', function(e) {
    vassert.testComplete();
  });
  server.listen(8800, function() {
    server.close();
  });
}

function testServerCloseWithCallback() {
  server = net.createServer();
  server.listen(8800, function() {
    server.close(function() {
      vassert.testComplete();
    });
  });
}

function testConnect() {
  server = net.createServer();
  server.listen(8800, function() { 
    net.connect(8800, function() {
      server.close();
      vassert.testComplete();
    });
  });
}

function testSocketReadWrite() {
  server = net.createServer();
  server.on('connection', function(socket) { 
    socket.on('data', function(buffer) {
      vassert.assertEquals('object', typeof buffer);
      vassert.assertEquals("crunchy bacon", buffer.toString());
      socket.destroy();
      server.close();
      vassert.testComplete();
    });
  });
  server.listen(8800, function() {
    socket = net.connect(8800, function() {
      socket.write("crunchy bacon");
    });
  });
}

function testSocketTimeout() {
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
}

function testSocketTimeoutCanceled() {
  server = net.createServer();
  server.on('connection', function(socket) { 
    socket.setTimeout(300, function() {
      vassert.fail("Should not have timed out");
    });
    socket.setTimeout(0);
  });
  server.listen(8800, function() {
    socket = net.connect(8800, function() {
      timer.setTimer(500, function() {
        socket.destroy();
        server.close();
        vassert.testComplete();
      });
    });
  });
}

function testSocketRemoteAddress() {
  server = net.createServer();
  server.listen(8800, function() {
    net.connect(8800, function(socket) {
        vassert.assertEquals('127.0.0.1', socket.remoteAddress);
        // Long vs. Int causes failure here
        vassert.assertEquals('8800', socket.remotePort.toString());
        socket.destroy();
        server.close();
        vassert.testComplete();
    });
  });
}

function testServerAddress() {
  server = net.createServer();
  server.listen(8800, function() {
    address = server.address();
    vassert.assertEquals(8800, address.port);
    // TODO: Vert.x does not provide bind address info?
    vassert.assertEquals("0.0.0.0", address.address);
    // vassert.assertEquals("IPv4", address.family);
    vassert.testComplete();
  });
}


vertxTest.startTests(this);
