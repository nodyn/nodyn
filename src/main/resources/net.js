
// nodej bits
var util          = require('util')
var Stream        = require('stream')
var EventEmitter  = require('events').EventEmitter
var Dispatcher    = process.binding('Dispatcher')
var vertx         = require('vertx')

// netty bits
var ChannelFactory  = org.jboss.netty.channel.socket.nio.NioServerSocketChannelFactory
var ChannelGroup    = org.jboss.netty.channel.group.DefaultChannelGroup
var ChannelHandler  = org.jboss.netty.channel.SimpleChannelHandler
var PipelineFactory = org.jboss.netty.channel.ChannelPipelineFactory
var ServerBootstrap = org.jboss.netty.bootstrap.ServerBootstrap
var ClientBootstrap = org.jboss.netty.bootstrap.ClientBootstrap
var Channels        = org.jboss.netty.channel.Channels

// java bits
var SocketAddress   = java.net.InetSocketAddress
var Executor        = java.util.concurrent.Executor
var Executors       = java.util.concurrent.Executors


var Server = function( listener ) {

  that = this;
  this.server = vertx.createNetServer().connectHandler( function(sock) {
    if (listener) {
      // TODO: Create a node.js compatible socket
      // to pass to the node-like listener
      listener(sock);
    }
  });

  this.connectionListener = listener
  this.address = {}

  this.log = function(msg) {
    return Dispatcher.submit( function() {
      java.lang.System.err.println(msg)
    } )
  }

  this.listen = function(port, host, callback) {
    if (typeof(host) == 'function') {
      callback = host;
      host = 'localhost';
    } else if (host == null || host == undefined) {
      host = "localhost";
    }
    this.server.listen(port, host);
    that.address.port = port;
    that.address.host = host;
    // TODO: Vert.x does not provide bind address information?
    // server.address.family = (address.address.address.length) == 4 ? 'IPv4' : 'IPv6'
    // server.address.address = address.address.canonicalHostName

    // TODO: Vert.x does not provide notification
    // for a 'listening' event whent the server
    // has been bound.
    if (callback) { 
      that.addListener('listening', callback); 
      that.emit('listening');
    }
  }

  this.close = function(callback) {
    this.server.close(function() { 
      if (callback) { that.addListener('close', callback); }
      that.emit('close'); 
    });
  }
}

var Socket = function(context, evnt) {
  this.factory = new ChannelFactory(Executors.newCachedThreadPool(), Executors.newCachedThreadPool())
  this.context  = context
  this.evnt     = evnt
  this.encoding = 'utf8'
  this.writable = true

  this.connect = function(port, host, connectListener) {
    this.type = 'tcp4'
    if (!host) {
      host = 'localhost'
    }
    bootstrap = new ClientBootstrap(this.factory)
    bootstrap.setPipelineFactory(ClientPipeline(this))
    bootstrap.setOption("keepAlive", false)
    bootstrap.setOption("tcpNoDelay", true)
    address = new SocketAddress(host, port)
    if (connectListener) {
      this.on('connect', connectListener)
    }
    this.emit('connect')
  }

  this.setEncoding = function(encoding) { 
    this.encoding = encoding
  }

  this.write = function(string, encoding, callback) { 
    return Dispatcher.submit(function(socket) {
      channel = socket.evnt.getChannel()
      future = channel.write(string)
      if (callback) {
        future.awaitUninterruptibly()
        callback.apply(callback)
      }
    }, this )
  }

  this.destroy = function() { 
    return Dispatcher.submit(function(socket) {
      socket.evnt.getChannel().close()
      socket.writable = false
      socket.emit('close')
    }, this)
  }

  this.end = function(data) {
    return Dispatcher.submit(function(socket) {
      if (data) {
        future = socket.write(data)
        future.awaitUninterruptibly()
      }
      future = socket.evnt.getChannel().close()
      future.awaitUninterruptibly()
      socket.writable = false
      socket.emit('end')
    }, this)
  }
  this.destroySoon = this.end

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

var ClientHandler = function(client) {
}

var ServerHandler = function(server) {

  return new ChannelHandler( {
    messageReceived: function(context, evnt) {
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
      server.emit('error', true)
      server.close()
    }
  } )
}

var ClientPipeline = function(client) {
  return new PipelineFactory( { 
    getPipeline: function() {
      handler = ClientHandler(client)
      return Channels.pipeline(handler)
    }
  } )
}

var ServerPipeline = function(server) {
  return new PipelineFactory( { 
    getPipeline: function() {
      handler = ServerHandler(server)
    server.log("SERVER: " + server.toString())
      return Channels.pipeline(handler)
    }
  } )
}

util.inherits(Server, EventEmitter)

module.exports.Socket = Socket
module.exports.Server = Server
module.exports.createServer = function(listener) {
  return new Server(listener)
}

