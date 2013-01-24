var AsyncResult = org.vertx.java.core.AsyncResult
var AsyncResultHandler = org.vertx.java.core.AsyncResultHandler

var Fs = function() {

  this.rename = function(oldPath, newPath, callback) {
    vertx.fileSystem().move(oldPath, newPath, new AsyncResultHandler({
      handle: function(ar) {
        if (callback) {
          ex = ar.exception ? new Error("rename failed for " + ar.exception.getMessage()) : null
          callback(ex)
        }
      }
    }))
  }

}

module.exports = new Fs()
