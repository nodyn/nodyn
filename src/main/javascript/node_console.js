var util = NativeRequire.require('util');

var DefaultLogger = function() {
  this.info = function(msg) {
    java.lang.System.out.println(msg);
  };

  this.error = function(msg) {
    java.lang.System.err.println(msg);
  };

  this.trace = function( l, ex ) {
    var msg = ["Error", l].join(': ');
    java.lang.System.err.println(msg);
    java.lang.System.err.println(ex.stack);
  };
};

var logger = (typeof __jcontainer == 'undefined' ? 
    new DefaultLogger() : 
    __jcontainer.logger());

var Console = function() {
  this.labels = {};

  this.log = function( msg ) {
    logger.info( util.format( msg ) );
  };

  this.error = function( msg ) {
    logger.error( util.format( msg ) );
  };

  this.dir  = function( obj ) {
    logger.info( util.inspect( obj ) );
  };

  this.info  = this.log;
  this.warn  = this.error;

  this.trace = function( label ) {
    logger.trace( label, new Error(label) );
  };

  this.assert = function( expression ) {
    if (!expression) {
      var arr = Array.prototype.slice.call(arguments, 1);
      require('assert').ok(false, util.format.apply(this, arr));
    }
  };

  this.time = function( label ) {
    this.labels[label] = Date.now();
  };

  this.timeEnd = function( label ) {
    var time = this.labels[label];
    if (!time) {
      throw new Error('No such label: ' + label);
    }
    var duration = Date.now() - time;
    logger.info(util.format('%s: %dms', label, duration));
  };
};

module.exports = new Console();

