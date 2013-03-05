var os = require('os')
var console = require('console')
var EventEmitter = require('events').EventEmitter

var NodeJ = function(process) {

  process.on = EventEmitter.prototype.on
  process.addListener = EventEmitter.prototype.addListener
  process.once = EventEmitter.prototype.once
  process.removeListener = EventEmitter.prototype.removeListener
  process.removeAllListeners = EventEmitter.prototype.removeAllListeners
  process.setMaxListeners = EventEmitter.prototype.setMaxListeners
  process.listeners = EventEmitter.prototype.listeners
  process.emit = EventEmitter.prototype.emit

  process.nextTick = function(callback, args) {
    process.binding('Dispatcher').submit(callback, args)
  }

  process.title = "nodej"

  process.memoryUsage = function() {
    var obj = {}
    obj.heapTotal = os.totalmem()
    obj.heapUsed  = os.totalmem() - os.freemem()
    return obj
  }

  this.console = console

  // TODO: process.config
  // Node.js puts the configure options that were used to compile the current
  // node executable in process.config
  process.config = {}
}

module.exports = NodeJ
