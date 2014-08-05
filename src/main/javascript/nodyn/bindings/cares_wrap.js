/*
 * Copyright 2014 Red Hat, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

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