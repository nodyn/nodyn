var helper = require('specHelper');

var System    = java.lang.System;
var userDir   = System.getProperty('user.dir');
var userHome  = System.getProperty('user.home');

var isWindows = process.platform === 'win32';
var fileSep   = System.getProperty("file.separator");

require.root  = userDir + "/src/test/resources/modules";

describe( "modules", function() {

  beforeEach(function() {
    helper.testComplete(false);
  });

  it("should have mod.dirname", function() {
    var dir = new java.io.File('./src/test/resources/modules/somemodule/lib').getCanonicalPath();
    var subdir = new java.io.File('./src/test/resources/modules/somemodule/lib/subdir').getCanonicalPath();
    var mod = require('somemodule');
    expect(mod.dirname).not.toBe(null);
    expect(mod.dirname).not.toBe(undefined);
    expect(mod.dirname).toBe(dir);
    expect(mod.subdir).toBe(subdir);
    helper.testComplete(true);
  });

  it("should have locate module's index.js", function() {
    var mod = require('amodule');
    expect(mod.flavor).toBe("nacho cheese");
    helper.testComplete(true);
  });

  it("should find module's package.json", function() {
    var mod = require('somemodule');
    expect(mod.flavor).toBe("cool ranch");
    helper.testComplete(true);
  });

  it("should find an load json files", function() {
    json = require('./conf.json');
    expect(json.somekey).toBe("somevalue");
    helper.testComplete(true);
  });


/*
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
    waitsFor(helper.testComplete, "waiting for read/write to complete", 3);
  });

  it("should support an idle socket timeout", function() {
    server = net.createServer();
    server.on('connection', function(socket) {
      socket.setTimeout(10, function() {
        socket.destroy();
        server.close();
        helper.testComplete(true);
      });
    });
    server.listen(8800, function() {
      socket = net.connect(8800);
    });
    waitsFor(helper.testComplete, "waiting for timeout to fire", 15);
  });

  it("should allow cancellation of an idle socket timeout", function() {
    server = net.createServer();
    server.on('connection', function(socket) {
      socket.setTimeout(300, function() {
        expect(true).toBe(false);
      });
      socket.setTimeout(0); // cancels the timeout we just set
    });
    server.listen(8800, function() {
      socket = net.connect(8800, function() {
        timer.setTimer(500, function() {
          server.close();
          helper.testComplete(true);
        });
      });
     });
    waitsFor(helper.testComplete, "waiting for timeout to fire", 15);
  });


  it( "should provide a remote address", function() {
    server = net.createServer();
    server.listen(8800, function() {
      net.connect(8800, function(socket) {
        expect(socket.remoteAddress).toBe('127.0.0.1');
        expect(socket.remotePort).toBe(8800);
        socket.destroy();
        server.close();
        helper.testComplete(true);
      });
    });
    waitsFor(helper.testComplete, "waiting for socket address to be checked", 3);
  });

  it( "should provide a server address", function() {
    server = net.createServer();
    server.listen(8800, function() {
      net.connect(8800, function(socket) {
        address = server.address();
        expect(address.port).toBe(8800);
        expect(address.address).toBe('0.0.0.0');
        expect(address.family).toBe('IPv4');
        helper.testComplete(true);
      });
    });
    waitsFor(helper.testComplete, "waiting for server address to be checked", 3);
  });
  */

});
