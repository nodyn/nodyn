var udp          = require('vertx/datagram');
var util         = require('util');
var EventEmitter = require('events').EventEmitter;

dgram = {};

Socket = function(type, callback) {
  var that = this;
  var ipv4 = true;
  if (type === 'udp6') {
    ipv4 = false;
  }

  // if a callback is provided, set it up as the message listener
  if (callback) {
    this.on('message', callback);
  }

  var delegate = new udp.DatagramSocket(ipv4);
  delegate.dataHandler(function(packet) {
    // TODO: Should we wrap the data in a buffer?
    that.emit('message', packet.data, packet.sender);
  });

  this.bind = function(port, address, callback) {
    switch(typeof address) {
      case 'function':
        callback = address;
        break;
      case 'undefined':
        address = '0.0.0.0';
        break;
    }
    if (callback) {
      this.on('listening', callback);
    }
    delegate.listen(port, address, function() {
      this.emit('listening');
    });
  };
};


util.inherits(Socket, EventEmitter);

module.exports.createSocket = createSocket = function(type, callback) {
  return new Socket(type, callback);
};

module.exports.Socket = Socket;
