
var NodeJ = function() {
  this.nextTick = function(callback, args) {
    process.binding('Dispatcher').submit(callback, args)
  }
}

module.exports = new NodeJ()
