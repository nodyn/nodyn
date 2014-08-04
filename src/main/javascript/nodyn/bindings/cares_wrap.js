
"use strict";

var util = require('util');

var cares = {};

function Cares() {
  this._cares = new io.nodyn.dns.CaresWrap( process._process );
  this._cares.on( 'lookup', Cares.prototype._onLookup.bind(this) );
}

Cares.prototype._onLookup = function(result) {
  var addr = result.result;
  var family = ( result.result instanceof java.net.Inet4Address ? 4 : 6 );
  this._req.oncomplete( undefined, [ result.result.hostAddress ], family );
}

Cares.prototype.lookup4 = function(host) {
  this._cares.lookup4( host );
}

cares.getaddrinfo = function(req, hostname, family) {
  var c = new Cares();
  c._req = req;
  c.lookup4( hostname );
}

cares.isIP = function(host) {
  if ( host.match( "^[0-9][0-9]?[0-9]?\\.[0-9][0-9]?[0-9]?\\.[0-9][0-9]?[0-9]?\\.[0-9][0-9]?[0-9]?$" ) ) {
    return 4;
  }

  return 0;
}


module.exports = cares;