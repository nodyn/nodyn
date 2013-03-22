
var Fs = function() {

  this.rename = vertx.fileSystem.move.bind( vertx.fileSystem );
  this.renameSync = vertx.fileSystem.moveSync.bind( vertx.fileSystem );

  this.truncate = vertx.fileSystem.truncate.bind( vertx.fileSystem );
  this.truncateSync = vertx.fileSystem.truncateSync.bind( vertx.fileSystem );

}

module.exports = new Fs()
