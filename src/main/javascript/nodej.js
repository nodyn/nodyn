
var NodeJ = function(process) {
  process.nextTick = function(callback, args) {
    process.binding('Dispatcher').submit(callback, args)
  }
}

module.exports = NodeJ
