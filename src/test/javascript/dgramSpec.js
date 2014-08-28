var helper = require('./specHelper');
var util   = require('util');
var dgram  = require('dgram');

describe('The dgram module', function() {

  it('should have a Socket object type', function() {
    expect(dgram.Socket !== null).toBeTruthy();
    expect(typeof dgram.Socket).toBe('function');
  });

  it('should allow creation of datagram udp4 socket objects', function() {
    expect(typeof dgram.createSocket).toBe('function');
    var socket = dgram.createSocket('udp4');
    expect(socket !== null).toBeTruthy();
    expect(socket instanceof dgram.Socket).toBeTruthy();
    socket.close();
  });

  it('should allow creation of datagram udp6 socket objects', function() {
    expect(typeof dgram.createSocket).toBe('function');
    var socket = dgram.createSocket('udp6');
    expect(socket !== null).toBeTruthy();
    expect(socket instanceof dgram.Socket).toBeTruthy();
    socket.close();
  });

  it('should bind a socket', function() {
    waitsFor(helper.testComplete, "the dgram bind test", 5000);
    var socket = dgram.createSocket('udp4');
    expect(socket !== null).toBeTruthy();
    expect(typeof socket.bind).toBe('function');
    socket.bind(54321, function() {
      socket.on('close', function() { helper.testComplete(true); });
      socket.close();
    });
  });

  it('should close a socket', function() {
    waitsFor(helper.testComplete, "the dgram socket close test", 5000);
    var socket = dgram.createSocket('udp4');
    expect(socket !== null).toBeTruthy();
    expect(typeof socket.close).toBe('function');
    socket.on('close', function() { helper.testComplete(true); });
    socket.close();
  });

  it('should have a socket with an address', function() {
    waitsFor(helper.testComplete, "the dgram socket address test", 5000);
    var socket = dgram.createSocket('udp4');
    expect(socket !== null).toBeTruthy();
    expect(typeof socket.address).toBe('function');
    socket.bind(54321, function() {
      var addr = socket.address();
      expect(addr !== undefined).toBeTruthy();
      expect(addr.address).toBe('0.0.0.0');
      expect(addr.family).toBe('IPv4');
      expect(addr.port).toBe(54321);
      socket.on('close', function() { helper.testComplete(true); });
      socket.close();
    });
  });

  // only tests the existence of the functions and not their behavior
  it('should pass testConfigurationFunctions', function() {
    var socket = dgram.createSocket('udp4');
    expect(typeof socket.setBroadcast).toBe('function');
    expect(typeof socket.setMulticastTTL).toBe('function');
    expect(typeof socket.setTTL).toBe('function');
    expect(typeof socket.setMulticastLoopback).toBe('function');
  });

  it('should send and receive packets', function() {
    waitsFor(helper.testComplete, "the dgram send / receive test", 5000);
    var peer1 = dgram.createSocket('udp4');
    var peer2 = dgram.createSocket('udp4');
    var buffer = new Buffer('turkey dinner');

    peer1.on('error', unexpectedError.bind(this));
    peer2.on('error', unexpectedError.bind(this));

    peer2.on('message', function(msg, rinfo) {
      expect(buffer.toString()).toBe(msg.toString());
      peer2.on('close', function() { helper.testComplete(true); });
      peer1.on('close', function() { peer2.close(); });
      peer1.close();
    });

    peer2.bind(54321, function() {
      peer1.send(buffer, 0, buffer.length, 54321, 'localhost');
    });
  });

  it('should echo packets', function() {
    waitsFor(helper.testComplete, "the dgram echo test", 5000);
    var peer1 = dgram.createSocket('udp4');
    var peer2 = dgram.createSocket('udp4');
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
        peer2.send(buffer, 0, buffer.length, 54321, 'localhost');
      });
    });
  });

  it('should allow setting the broadcast option on a socket', function() {
    waitsFor(helper.testComplete, "the dgram broadcast test", 5000);
    var peer1 = dgram.createSocket('udp4');
    var peer2 = dgram.createSocket('udp4');

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
    waitsFor(helper.testComplete, "the dgram broadcast test", 5000);
    var buffer = new Buffer('steak frites');
    var groupAddress = '230.0.0.1';
    var received = false;

    var peer1 = dgram.createSocket('udp4');
    var peer2 = dgram.createSocket('udp4');

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

function unexpectedError(e) { console.error("ERROR: " + e); this.fail(e); }
