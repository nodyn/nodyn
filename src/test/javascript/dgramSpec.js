var helper = require('specHelper');
var util   = require('util');
var dgram  = require('dgram');

describe('The dgram module', function() {

  it('should have a Socket object type', function() {
    expect(dgram.Socket !== null).toBeTruthy();
    expect(typeof dgram.Socket).toBe('function');
  });

  it('should allow creation of datagram socket objects', function() {
    expect(typeof dgram.createSocket).toBe('function');
    var socket = dgram.createSocket();
    expect(socket !== null).toBeTruthy();
    expect(socket instanceof dgram.Socket).toBeTruthy();
  });

  it('should pass testSocketBind', function() {
    waitsFor(helper.testComplete, "the dgram bind test", 5);
    var socket = dgram.createSocket();
    expect(socket !== null).toBeTruthy();
    expect(typeof socket.bind).toBe('function');
    socket.bind(54321, function() {
      socket.on('close', function() { helper.testComplete(true); });
      socket.close();
    });
  });

  it('should pass testSocketClose', function() {
    waitsFor(helper.testComplete, "the dgram socket close test", 5);
    var socket = dgram.createSocket();
    expect(socket !== null).toBeTruthy();
    expect(typeof socket.close).toBe('function');
    socket.on('close', function() { helper.testComplete(true); });
    socket.close();
  });

  it('should pass testSocketAddress', function() {
    waitsFor(helper.testComplete, "the dgram socket address test", 5);
    var socket = dgram.createSocket();
    expect(socket !== null).toBeTruthy();
    expect(typeof socket.address).toBe('function');
    socket.bind(54321, function() {
      var addr = socket.address();
      expect(addr !== undefined).toBeTruthy();
      expect(typeof addr.address).toBe('string');
      expect(typeof addr.family).toBe('string');
      expect(typeof addr.port).toBe('number');
      socket.on('close', function() { helper.testComplete(true); });
      socket.close();
    });
  });

  // only tests the existence of the functions and not their behavior
  it('should pass testConfigurationFunctions', function() {
    var socket = dgram.createSocket();
    expect(typeof socket.setBroadcast).toBe('function');
    expect(typeof socket.setMulticastTTL).toBe('function');
    expect(typeof socket.setTTL).toBe('function');
    expect(typeof socket.setMulticastLoopback).toBe('function');
  });

  it('should pass testSendReceive', function() {
    waitsFor(helper.testComplete, "the dgram send / receive test", 5);
    var peer1 = dgram.createSocket();
    var peer2 = dgram.createSocket();
    var buffer = new Buffer('turkey dinner');

    peer1.on('error', unexpectedError.bind(this));
    peer2.on('error', unexpectedError.bind(this));

    peer2.on('message', function(msg, rinfo) {
      expect(buffer.toString()).toBe(msg.toString());
      peer1.on('close', function() { peer2.close(); });
      peer2.on('close', function() { helper.testComplete(true); });
      peer1.close();
    });

    peer2.bind(54321, function() {
      peer1.send(buffer, 0, buffer.length, 54321, '0.0.0.0');
    });
  });

  it('should pass testEcho', function() {
    waitsFor(helper.testComplete, "the dgram echo test", 5);
    var peer1 = dgram.createSocket();
    var peer2 = dgram.createSocket();
    var buffer = new Buffer('turkey dinner');

    peer1.on('error', unexpectedError.bind(this));
    peer2.on('error', unexpectedError.bind(this));

    peer1.on('message', function(msg, rinfo) {
      expect(buffer.toString()).toBe(msg.toString());
      peer1.send(msg, 0, msg.length, rinfo.port, rinfo.address);
    });

    peer2.on('message', function(msg, rinfo) {
      expect(buffer.toString()).toBe(msg.toString());
      peer1.on('close', function() { peer2.close(); });
      peer2.on('close', function() { helper.testComplete(true); });
      peer1.close();
    });

    peer2.bind(54321, function() {
      peer1.bind(54322, function() {
        peer2.send(buffer, 0, buffer.length, 54321, '0.0.0.0');
      });
    });
  });

  it('should pass testBroadcast', function() {
    waitsFor(helper.testComplete, "the dgram broadcast test", 5);
    var peer1 = dgram.createSocket();
    var peer2 = dgram.createSocket();

    peer1.setBroadcast(true);
    peer2.setBroadcast(true);

    var buffer = new Buffer('turkey dinner');

    peer1.on('error', unexpectedError.bind(this));
    peer2.on('error', unexpectedError.bind(this));

    peer1.on('message', function(msg, rinfo) {
      expect(msg.toString()).toBe(buffer.toString());
      peer1.on('close', function() { peer2.close(); });
      peer2.on('close', function() { helper.testComplete(true); });
      peer1.close();
    });

    peer1.bind(54321, function() {
      peer2.send(buffer, 0, buffer.length, 54321, '255.255.255.255');
    });
  });

  // TODO: Figure out WTF is going on here.
  xit('should add and drop multicast group membership', function() {
    waitsFor(helper.testComplete, "the dgram broadcast test", 5);
    var buffer = new Buffer('steak frites');
    var groupAddress = '230.0.0.1';
    var received = false;

    var peer1 = dgram.createSocket();
    var peer2 = dgram.createSocket();

    peer1.on('error', unexpectedError.bind(this));
    peer2.on('error', unexpectedError.bind(this));

    peer1.on('message', function(msg, rinfo) {
      expect(msg.toString()).toBe(buffer.toString());

      // now drop peer1's membership in the group and fail if it gets any more
      // messages
      peer1.dropMembership(groupAddress);

      peer1.on('message', function(msg, rinfo) {
        this.fail("Should have dropped group membership");
      }.bind(this));

      // send another message to the group and wait to see if
      // peer2 gets it - if not, end succesfully
      peer2.send(buffer, 0, buffer.length, 54321, groupAddress, function() {
        setTimeout(function() {
          helper.testComplete(true);
        }, 1000);
      });
    });

    peer1.bind(54321, function() {
      peer1.addMembership(groupAddress);
      // send a message to the multicast group
      peer2.send(buffer, 0, buffer.length, 54321, groupAddress);
    });
  });

  beforeEach(function() {
    helper.testComplete(false);
  });
});

function unexpectedError(e) { print("ERROR: " + e); this.fail(e); }
