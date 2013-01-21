
// nodej bits
var util          = require('util')
var Stream        = require('stream')
var EventEmitter  = require('events').EventEmitter
var Dispatcher    = process.binding('Dispatcher')

// netty bits
var ChannelFactory  = org.jboss.netty.channel.socket.nio.NioServerSocketChannelFactory
var ChannelGroup    = org.jboss.netty.channel.group.DefaultChannelGroup
var ChannelHandler  = org.jboss.netty.channel.SimpleChannelHandler
var PipelineFactory = org.jboss.netty.channel.ChannelPipelineFactory
var ServerBootstrap = org.jboss.netty.bootstrap.ServerBootstrap
var Channels        = org.jboss.netty.channel.Channels

// java bits
var SocketAddress   = java.net.InetSocketAddress
var Executor        = java.util.concurrent.Executor
var Executors       = java.util.concurrent.Executors


var Server = function(listener) {
  this.factory = new ChannelFactory(Executors.newCachedThreadPool(), Executors.newCachedThreadPool())
  this.channels = new ChannelGroup("nodej")
  this.connectionListener = listener
  this.address = {}

  this.log = function(msg) {
    java.lang.System.err.println(msg)
  }

  this.createAndBind = function(address) {
    this.log('Creating server')
    bootstrap = new ServerBootstrap(this.factory)
    bootstrap.setPipelineFactory(Pipeline(this))
    bootstrap.setOption("child.keepAlive", true)
    bootstrap.setOption("child.tcpNoDelay", true)
    this.channels.add( bootstrap.bind(address) )
  }

  this.listen = function(port, callback) {
    if (callback) { 
      this.addListener('listening', callback); 
    }

    Dispatcher.submit(function(server, port) {
      address = new SocketAddress(port)
      server.address.port = address.port
      server.address.family = (address.address.address.length) == 4 ? 'IPv4' : 'IPv6'
      server.address.address = address.address.canonicalHostName
      server.createAndBind(address)
      server.log("Listening on: " + address)
      server.emit('listening')
    }, this, port)
  }

  this.close = function(callback) {
    Dispatcher.submit( function(server) {
      future = server.channels.close()
      future.awaitUninterruptibly()
      server.factory.releaseExternalResources()
      server.emit('close')
      if (callback) {
        callback()
      }
    }, this)
  }
}

var Socket = function(context, evnt) {
  this.context  = context
  this.evnt     = evnt
  this.encoding = 'utf8'

  this.connect = function() {
    this.type = 'tcp4'
  }

  this.setEncoding = function(encoding) { 
    this.encoding = encoding
  }

  this.write = function(string, encoding) { 
    Dispatcher.submit(function(channel) {
      channel.write(string)
    }, this.evnt.getChannel() )
  }

  this.destroy = function() { 
    Dispatcher.submit(function(socket) {
      socket.evnt.getChannel().close()
      socket.emit('close')
    }, this)
  }

  this.pause = function() { }
  this.resume = function() { }
  this.setTimeout = function() { }
  this.setNoDelay = function() { }
  this.setKeepAlive = function() { }
  this.address = function() { }
  this.bytesRead = 0
  this.bytesWritten = 0
}
// Inheriting from Stream automatically makes
// us an EventEmitter too. Yay.
util.inherits(Socket, Stream)


var Pipeline = function(server) {
  return new PipelineFactory( { 
    getPipeline: function() {
      handler = ServerHandler(server)
      return Channels.pipeline(handler)
    }
  } )
}

var ServerHandler = function(server) {

  return new ChannelHandler( {
    messageReceived: function(context, evnt) {
      channel = evnt.getChannel()
      channel.write( evnt.getMessage() )
      callback = server.connectionListener
      if (callback) {
        // Create a new socket object and give it
        // to the connection listener
        callback.apply( callback, new Socket(context, evnt) )
      }
    },

    channelOpen: function(context, evnt) {
      server.channels.add( evnt.getChannel() )
      server.emit('connection')
    },

    exceptionCaught: function(context, evnt) {
      evnt.cause.printStackTrace()
      evnt.channel.close()
      server.emit('error')
      server.close()
    }
  } )
}

util.inherits(Server, EventEmitter)

module.exports.Socket = Socket
module.exports.Server = Server
module.exports.createServer = function(listener) {
  return new Server(listener)
}

