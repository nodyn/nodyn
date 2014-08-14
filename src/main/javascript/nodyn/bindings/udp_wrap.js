var Family = io.nodyn.udp.UDPWrap.Family;

function onRecv(nread, buffer, remoteAddress, remotePort) {
  if (typeof this.onmessage === 'function') {
    var rinfo = {
      address: remoteAddress,
      port: remotePort
    };
    this.onmessage(nread, this, buffer, rinfo);
  }
}

var UDP = function() {
  if (!(this instanceof UDP)) return new UDP;

  this._udp = new io.nodyn.udp.UDPWrap( process._process );
  this._udp.on('recv', onRecv.bind(this));
}
module.exports.UDP = UDP;

UDP.prototype.bind = function(ip, port, flags) {
  this._udp.bind(ip, port, flags, Family.IPv4);
  // TODO: This should return an error if there is one
};

UDP.prototype.bind6 = function(ip, port, flags) {
  this._udp.bind(ip, port, flags, Family.IPv6);
  // TODO: This should return an error if there is one
}

UDP.prototype.close = function() {
  this._udp.close();
};

UDP.prototype.recvStart = function() {
  this._udp.recvStart();
}

UDP.prototype.ref = function() {
  this._udp.ref();
};

UDP.prototype.unref = function() {
  this._udp.unref();
};

UDP.prototype.send = function(req, buffer, offset, length, port, address) {
  this._udp.send(Family.IPv4);
};

UDP.prototype.send6 = function(req, buffer, offset, length, port, address) {
  this._udp.send(Family.IPv6);
};

UDP.prototype.recvStop = function() {};
UDP.prototype.getsockname = function() {};
UDP.prototype.addMembership = function() {};
UDP.prototype.dropMembership = function() {};
UDP.prototype.setMulticastTTL = function() {};
UDP.prototype.setMulticastLoopback = function() {};
UDP.prototype.setBroadcast = function() {};
UDP.prototype.setTTL = function() {};

/**
var Socket = function(type, callback) {
  var family = Datagram.InternetProtocolFamily.IPv4;
  if (type === 'udp6') { family = Datagram.InternetProtocolFamily.IPv6; }

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
  if (!(buf instanceof Buffer)) {
    buf = new Buffer(buf.toString());
  }
  this._delegate.send(buf.slice(offset, offset+length)._vertxBuffer(), address, port, function(result) {
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

function convertAddress(javaInetAddr) {
  var addr = javaInetAddr.getAddress();
  return {
    address: addr.getHostAddress(),
    port: javaInetAddr.getPort(),
    family: (addr instanceof java.net.Inet4Address) ? 'IPv4' : 'IPv6'
  };
}
*/
