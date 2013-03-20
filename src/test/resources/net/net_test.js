load('vertx_tests.js');

var net = require('net');

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
  listenCallback = function() { listening = true; }
  server.listen(8800, listenCallback);

  tries = 0;
  // now wait up to 3 seconds for the event to be fired
  vertx.setPeriodic(1000, function(id) {
    if (listening || tries++ > 3) {
      vertx.cancelTimer(id);
      server.close();
      vassert.assertTrue(listening);
      vassert.testComplete();
    }
  });
}

function testServerClose() {
  closed = false;
  listening = false;
  server = net.createServer();
  listenCallback = function() { listening = true; }
  server.listen(8800, listenCallback);
  server.on('close', function(e) { closed = true; });

  tries = 0;
  vertx.setPeriodic(1000, function(id) {
    if (listening || tries++ > 3) {
      vertx.cancelTimer(id);
      server.close();
      tries = 0;
      vertx.setPeriodic(1000, function(id2) {
        if (closed || tries++ > 3) {
          vertx.cancelTimer(id2);
          vassert.assertTrue(closed);
          vassert.testComplete();
        }
      });
    }
  });
}

function testServerCloseWithCallback() {
  closed = false;
  listening = false;
  server = net.createServer();
  listenCallback = function() { listening = true; }
  server.listen(8800, listenCallback);

  tries = 0;
  vertx.setPeriodic(1000, function(id) {
    if (listening || tries++ > 3) {
      vertx.cancelTimer(id);
      server.close(function() { closed = true; });
      tries = 0;
      vertx.setPeriodic(1000, function(id2) {
        if (closed || tries++ > 3) {
          vertx.cancelTimer(id2);
          vassert.assertTrue(closed);
          vassert.testComplete();
        }
      });
    }
  });
}

function testConnect() {
  connected = false;
  server = net.createServer();
  server.listen(8800, function() { connected = true; });
  net.connect(8800);
  tries = 0;
  vertx.setPeriodic(1000, function(id) {
    if (connected || tries++ > 3) {
      vertx.cancelTimer(id);
      vassert.assertTrue(connected);
      server.close();
      vassert.testComplete();
    }
  });
}

function testConnectWithCallback() {
  connected = false;
  server = net.createServer();
  server.listen(8800);
  net.connect(8800, function() { connected = true; });
  tries = 0;
  vertx.setPeriodic(1000, function(id) {
    if (connected || tries++ > 3) {
      vertx.cancelTimer(id);
      vassert.assertTrue(connected);
      server.close();
      vassert.testComplete();
    }
  });
}

function testSocketReadWrite() {
  data = undefined;
  server = net.createServer();
  server.listen(8800);
  server.on('connection', function(socket) { 
    socket.on('data', function(buffer) {
      data = buffer; 
    });
  });
  socket = net.connect(8800, function() {
    socket.write("crunchy bacon", function() { 
      socket.destroy();
    });
  });
  tries = 0;
  vertx.setPeriodic(1000, function(id) {
    if (data || tries++ > 3) {
      vertx.cancelTimer(id);
      vassert.assertEquals("crunchy bacon", data);
      server.close();
      vassert.testComplete();
    }
  });
}

function testServerAddress() {
  listening = false;
  server = net.createServer();
  listenCallback = function() { 
    listening = true;
  }
  server.listen(8800, listenCallback);

  // now wait up to 3 seconds for the event to be fired
  tries = 0;
  vertx.setPeriodic(1000, function(id) {
    if (tries++ > 3 || listening) {
      vertx.cancelTimer(id);
    }
  });
  vassert.assertEquals(8800, server.address.port);
  // TODO: Vert.x does not provide bind address info?
  // vassert.assertEquals("0.0.0.0", server.address.address);
  // vassert.assertEquals("IPv4", server.address.family);
  server.close();
  vassert.testComplete();
}


initTests(this);
