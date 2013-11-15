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
      vassert.testComplete();
    });
  }
};

vertxTest.startTests(dgramTest);

