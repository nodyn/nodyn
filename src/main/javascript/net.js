var util = require('util')
var EventEmitter = require('events').EventEmitter
var ServerFactory = org.projectodd.nodej.bindings.net.ServerFactory

module.exports.Socket = function() {
}

var Server = function(listener) {
  var _log = java.lang.System.out
  var _dispatcher = process.binding('Dispatcher')
  var _server = ServerFactory.createServer()

  this.log = function(msg) {
    _log.println(msg)
  }

  this.listen = function(port, callback) {
    if (callback) { 
      this.addListener('listening', callback); 
    }
    _dispatcher.submit(function(server, port) {
      server.log("Listening on port " + port)
      server.emit('listening')
    }, this, port)
  }
}

util.inherits(Server, EventEmitter)

module.exports.Server = Server
module.exports.createServer = function(listener) {
  return new Server(listener)
}

