var udp          = NativeRequire.require('vertx/datagram');
var util         = NativeRequire.require('util');
var EventEmitter = NativeRequire.require('events').EventEmitter;

Socket = function(type, callback) {
  var that = this;
  var ipv4 = true;
  if (type === 'udp6') {
    ipv4 = false;
  }

  // if a callback is provided, set it up as the message listener
  if (callback) {
    that.on('message', callback);
  }

  var delegate = new udp.DatagramSocket(ipv4);
  var inetAddress; // underlying Java object

  delegate.dataHandler(function(packet) {
    // TODO: Should we wrap the data in a buffer?
    that.emit('message', packet.data, packet.sender);
  });

  this.bind = function(port, host, callback) {
    switch(typeof host) {
      case 'function':
        callback = host;
        host = '0.0.0.0';
        break;
      case 'undefined':
        host = '0.0.0.0';
        break;
    }
    if (callback) {
      that.on('listening', callback);
    }

    delegate.exceptionHandler(function(err) {
      that.emit('error', err);
    });

    delegate.dataHandler(function(packet) {
      that.emit('message', packet.data(), 
        {address: packet.sender, bytes: packet.data().length()});
    });

    delegate.listen(port, host, function() {
      that.emit('listening');
    });
  };

  this.close = function() {
    delegate.close(function() {
      that.emit('close');
    });
  };

  this.address = function() {
    localAddr =  delegate.localAddress();
    return localAddr;
  };

  this.setBroadcast = function(flag) {
    delegate.broadcast(flag);
  };

  this.setMulticastTTL = function(ttl) {
    delegate.setMulticastTimeToLive(ttl);
  };

  this.setTTL = this.setMulticastTTL;

  this.setMulticastLoopback = function(loopback) {
    delegate.multicastLoopbackMode(loopback);
  };

  this.addMembership = function(mcastAddr, mcastIface) {
    delegate.listenMulticastGroup(mcastAddr, function() {}, null, mcastIface);
  };

  this.dropMembership = function(mcastAddr, mcastIface) {
    delegate.unlistenMulticastGroup(mcastAddr, function() {}, null, mcastIface);
  };

  this.send = function(buf, offset, length, port, address, callback) {
    // todo - deal with offset and length ffs
    delegate.send(address, port, buf, function() {
      if (typeof callback === 'function') {
        callback.call();
      }
    });
  };
};


util._extend(Socket.prototype, EventEmitter.prototype);

module.exports.createSocket = createSocket = function(type, callback) {
  return new Socket(type, callback);
};

module.exports.Socket = Socket;
