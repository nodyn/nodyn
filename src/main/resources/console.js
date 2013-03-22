var util = require('util')

var Console = function() {
  this.logger = vertx.logger;
  this.labels = {}

  this.log = function( msg ) {
    this.logger.info( util.format( msg ) );
  }

  this.error = function( msg ) {
    this.logger.error( util.format( msg ) );
  }

  this.dir  = function( obj ) {
    this.logger.info( util.inspect( obj ) );
  }

  this.info  = this.log
  this.warn  = this.error

  this.trace = function( label ) {
    this.logger.trace( label, new java.lang.Exception(label) );
  }

  this.assert = function( expression ) {
    if (!expression) {
      var arr = Array.prototype.slice.call(arguments, 1);
      require('assert').ok(false, util.format.apply(this, arr));
    }
  }

  this.time = function( label ) {
    this.labels[label] = Date.now();
  }

  this.timeEnd = function( label ) {
    var time = this.labels[label];
    if (!time) {
      throw new Error('No such label: ' + label);
    }
    var duration = Date.now() - time;
    this.logger.info(util.format('%s: %dms', label, duration));
  };
}

module.exports = new Console()

