__node = new org.projectodd.nodej.Node(dynjs.runtime);
// Node creates a global process object
process.title = "NodeJ";

EventEmitter               = require('events').EventEmitter
process.on                 = EventEmitter.prototype.on
process.addListener        = EventEmitter.prototype.addListener
process.once               = EventEmitter.prototype.once
process.removeListener     = EventEmitter.prototype.removeListener
process.removeAllListeners = EventEmitter.prototype.removeAllListeners
process.setMaxListeners    = EventEmitter.prototype.setMaxListeners
process.listeners          = EventEmitter.prototype.listeners
process.emit               = EventEmitter.prototype.emit

dynjs.global.__filename = __node.getFilename();
dynjs.global.__dirname  = __node.getDirname();

os = require('os');
process.memoryUsage = function() {
  var obj = {};
  obj.heapTotal = os.totalmem();
  obj.heapUsed  = os.totalmem() - os.freemem();
  return obj;
}

process.nextTick = function(callback, args) {
  process.binding('Dispatcher').submit(callback, args)
}

// TODO: process.config
// Node.js puts the configure options that were used to compile the current
// node executable in process.config
process.config = {}

