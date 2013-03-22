
var Fs = function() {

  this.rename = function(oldPath, newPath, callback) {
    vertx.fileSystem.move( oldPath, newPath, function(result) { 
      callback(); 
    } );
  }
  
  this.renameSync = vertx.fileSystem.moveSync.bind( vertx.fileSystem );

  this.truncate = vertx.fileSystem.truncate.bind( vertx.fileSystem );
  this.truncateSync = vertx.fileSystem.truncateSync.bind( vertx.fileSystem );

}

module.exports = new Fs()
