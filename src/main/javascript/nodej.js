var os = require('os')

var NodeJ = function(process) {

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

  // TODO: process.config
  // Node.js puts the configure options that were used to compile the current
  // node executable in process.config
  process.config = {}
}

module.exports = NodeJ
