
var Fs = function() {

  this.rename = function(oldPath, newPath, callback) {
    vertx.fileSystem.move(oldPath, newPath, callback);
  }

  this.renameSync = function(oldPath, newPath) {
    vertx.fileSystem.moveSync(oldPath, newPath)
  }

}

module.exports = new Fs()
