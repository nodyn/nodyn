var util         = NativeRequire.require('util');
var EventEmitter = NativeRequire.require('events').EventEmitter;
var vertx        = org.vertx.java.core.datagram;

function convertAddress(javaInetAddr) {
  var addr = javaInetAddr.getAddress();
  return {
    address: addr.getHostAddress(),
    port: javaInetAddr.getPort(),
    family: (addr instanceof java.net.Inet4Address) ? 'IPv4' : 'IPv6'
  };
}

var Socket = function(type, callback) {
  var family = vertx.InternetProtocolFamily.IPv4;
  if (type === 'udp6') { family = vertx.InternetProtocolFamily.IPv6; }

  this._delegate = process.context.createDatagramSocket(family);

  this._delegate.exceptionHandler(
    function(err) {
      this.emit('error', new Error(err));
    }.bind(this));

  // if a callback is provided, set it up as the message listener
  if (typeof callback === 'function') { this.on('message', callback); }
};
util.inherits(Socket, EventEmitter);

Socket.prototype.bind = function(port, host, callback) {
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
    this.on('listening', callback);
  }
  var mcastIface = java.net.NetworkInterface.getByInetAddress(java.net.InetAddress.getByName('127.0.0.1')).getName();
  this._delegate.setMulticastNetworkInterface(mcastIface);

  this._delegate.dataHandler(function(packet) {
    var data = packet.data();
    this.emit('message', new Buffer(data),
      {address: convertAddress(packet.sender()), bytes: data.length()});
  }.bind(this));

  this._delegate.listen(host, port, function(result) {
    if (!result.failed()) {
      this.emit('listening');
    } else {
      this.emit('error', new Error(result.cause()));
    }
  }.bind(this));
};

Socket.prototype.close = function() {
  this._delegate.close(function() {
    this.emit('close');
  }.bind(this));
};

Socket.prototype.address = function() {
  return convertAddress(this._delegate.localAddress());
};

Socket.prototype.setBroadcast = function(flag) {
  this._delegate.setBroadcast(flag);
};

Socket.prototype.setMulticastTTL = function(ttl) {
  this._delegate.setMulticastTimeToLive(ttl);
};
Socket.prototype.setTTL = Socket.prototype.setMulticastTTL;

Socket.prototype.setMulticastLoopback = function(loopback) {
  this._delegate.setMulticastLoopbackMode(loopback);
};

Socket.prototype.addMembership = function(mcastAddr, mcastIface) {
  if (!mcastIface) {
    mcastIFace = java.net.NetworkInterface.getByInetAddress(java.net.InetAddress.getByName("127.0.0.1")).getName();
  }
  this._delegate.listenMulticastGroup(mcastAddr, mcastIface, null, function(result) {
    if (result.failed()) {
      result.cause().printStackTrace();
      var err = new Error(result.cause());
      this.emit('error', err);
    }
  }.bind(this));
};

Socket.prototype.dropMembership = function(mcastAddr, mcastIface) {
  if (!mcastIface) {
    this._delegate.unlistenMulticastGroup(mcastAddr, null);
  } else {
    this._delegate.unlistenMulticastGroup(mcastAddr, mcastIface, null, null);
  }
};

Socket.prototype.send = function(buf, offset, length, port, address, callback) {
  // todo - deal with offset and length ffs
  if (!(buf instanceof Buffer)) {
    buf = new Buffer(buf.toString());
  }
  this._delegate.send(buf.slice(offset, offset+length).delegate, address, port, function(result) {
    if (result.failed()) { this.emit('error', new Error(result.cause())); }
    else if (typeof callback === 'function') {
      callback.call();
    }
  });
};

module.exports.createSocket = createSocket = function(type, callback) {
  return new Socket(type, callback);
};

module.exports.Socket = Socket;
