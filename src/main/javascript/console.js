var util = require('util')

var Console = function() {
  this.logger = process.binding('logger')

  this.log = function( msg ) {
    this.logger.out( util.format( msg ) );
  }

  this.error = function( msg ) {
    this.logger.err( util.format( msg ) );
  }
}

module.exports = new Console()
