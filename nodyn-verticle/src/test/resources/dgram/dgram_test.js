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
      vassert.assertEquals('object', typeof addr);
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
      peer1.on('close', peer2.close);
      peer2.on('close', function() { vassert.testComplete(); });
      peer1.close();
    });

    peer2.bind(54321, function() {
      peer1.send(buffer, 0, buffer.length(), 54321, '0.0.0.0', buffer);
    });
  }
};

var unexpectedError = function() { vassert.fail("Unexpected error"); };

vertxTest.startTests(dgramTest);

