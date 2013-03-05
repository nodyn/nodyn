var AsyncResult = org.vertx.java.core.AsyncResult
var AsyncResultHandler = org.vertx.java.core.AsyncResultHandler
var FileSystem = vertx.fileSystem()

var Fs = function() {

  this.rename = function(oldPath, newPath, callback) {
    FileSystem.move(oldPath, newPath, new AsyncResultHandler({
      handle: function(ar) {
        if (callback) {
          ex = ar.exception ? new Error("rename failed for " + ar.exception.getMessage()) : null
          callback(ex)
        }
      }
    }))
  }

  this.renameSync = function(oldPath, newPath) {
    FileSystem.moveSync(oldPath, newPath)
  }

}

module.exports = new Fs()
