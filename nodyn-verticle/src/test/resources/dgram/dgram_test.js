var Buffer    = require('vertx/buffer');
var vertxTest = require('vertx_tests');
var vassert   = vertxTest.vassert;

var util  = require('util');
var dgram = require('dgram');

dgramTest = {
  testSocket: function() {
    vassert.assertTrue(dgram.Socket !== null);
    vassert.assertEquals('function', typeof dgram.Socket);
    vassert.testComplete();
  },

  testDgramCreateSocket: function() {
    vassert.assertEquals('function', typeof dgram.createSocket);
    var socket = dgram.createSocket();
    vassert.assertTrue(socket !== null);
    vassert.testComplete();
  },

  testSocketBind: function() {
    var socket = dgram.createSocket();
    vassert.assertTrue(socket !== null);
    vassert.assertEquals('function', typeof socket.bind);
    socket.bind(54321, function() {
      socket.on('close', function() { vassert.testComplete(); });
      socket.close();
    });
  },

  testSocketClose: function() {
    var socket = dgram.createSocket();
    vassert.assertTrue(socket !== null);
    vassert.assertEquals('function', typeof socket.close);
    socket.on('close', function() { vassert.testComplete(); });
    socket.close();
  },

  testSocketAddress: function() {
    var socket = dgram.createSocket();
    vassert.assertTrue(socket !== null);
    vassert.assertEquals('function', typeof socket.address);
    socket.bind(54321, function() {
      var addr = socket.address();
      vassert.assertTrue(addr !== undefined);
      vassert.assertEquals('string', typeof addr.address);
      vassert.assertEquals('string', typeof addr.family);
      vassert.assertEquals('number', typeof addr.port);
      socket.on('close', function() { vassert.testComplete(); });
      socket.close();
    });
  },

  // only tests the existence of the functions and not their behavior
  testConfigurationFunctions: function() {
    var socket = dgram.createSocket();
    vassert.assertEquals('function', typeof socket.setBroadcast);
    vassert.assertEquals('function', typeof socket.setMulticastTTL);
    vassert.assertEquals('function', typeof socket.setTTL);
    vassert.assertEquals('function', typeof socket.setMulticastLoopback);
    vassert.testComplete();
  },

  testSendReceive: function() {
    var peer1 = dgram.createSocket();
    var peer2 = dgram.createSocket();
    var buffer = new Buffer('turkey dinner');

    peer1.on('error', unexpectedError);
    peer2.on('error', unexpectedError);

    peer2.on('message', function(msg, rinfo) {
      vassert.assertEquals(buffer.toString(), msg.toString());
      peer1.on('close', peer2.close);
      peer2.on('close', function() { vassert.testComplete(); });
      peer1.close();
    });

    peer2.bind(54321, function() {
      peer1.send(buffer, 0, buffer.length(), 54321, '0.0.0.0');
    });
  },

  testEcho: function() {
    var peer1 = dgram.createSocket();
    var peer2 = dgram.createSocket();
    var buffer = new Buffer('turkey dinner');

    peer1.on('error', unexpectedError);
    peer2.on('error', unexpectedError);

    peer1.on('message', function(msg, rinfo) {
      vassert.assertEquals(buffer.toString(), msg.toString());
      peer1.send(msg, 0, msg.length(), rinfo.port, rinfo.address);
    });

    peer2.on('message', function(msg, rinfo) {
      vassert.assertEquals(buffer.toString(), msg.toString());
      peer1.on('close', peer2.close);
      peer2.on('close', function() { vassert.testComplete(); });
      peer1.close();
    });

    peer2.bind(54321, function() {
      peer1.bind(54321, function() {
        peer2.send(buffer, 0, buffer.length(), 54321, '0.0.0.0');
      });
    });
  },

  testBroadcast: function() {
    var peer1 = dgram.createSocket();
    var peer2 = dgram.createSocket();

    peer1.setBroadcast(true);
    peer2.setBroadcast(true);

    var buffer = new Buffer('turkey dinner');

    peer1.on('error', unexpectedError);
    peer2.on('error', unexpectedError);

    peer1.on('message', function(msg, rinfo) {
      vassert.assertEquals(buffer.toString(), msg.toString());
      peer1.on('close', peer2.close);
      peer2.on('close', function() { vassert.testComplete(); });
      peer1.close();
    });

    peer1.bind(54321, function() {
      peer2.send(buffer, 0, buffer.length(), 54321, '255.255.255.255');
    });
  },

  DEFERREDtestAddDropMembership: function() {
    var buffer = new Buffer('steak frites');
    var groupAddress = '230.0.0.1';
    var received = false;

    var peer1 = dgram.createSocket();
    var peer2 = dgram.createSocket();

    peer2.on('message', function(msg, rinfo) {
      vassert.assertEquals(buffer.toString(), msg.toString());

      // now drop peer2's membership in the group and fail if it gets any more messages
      peer2.dropMembership(groupAddress);

      peer2.on('message', function(msg, rinfo) {
        vassert.fail("Should have dropped group membership");
      });

      // send another message to the group and wait to see if
      // peer2 gets it - if not, end succesfully
      peer1.send(buffer, 0, buffer.length(), 54321, groupAddress, function() {
        setTimeout(function() {
          vassert.testComplete();
        }, 1000);
      });
    });

    peer2.bind(54321, '127.0.0.1', function() {
      peer2.addMembership(groupAddress);

      // send a message to the multicast group
      peer1.send(buffer, 0, buffer.length(), 54321, groupAddress);
    });
  }
};

var unexpectedError = function() { vassert.fail("Unexpected error"); };

vertxTest.startTests(dgramTest);

