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

cares.isIP = function(host) {
  if ( host.match( "^[0-9][0-9]?[0-9]?\\.[0-9][0-9]?[0-9]?\\.[0-9][0-9]?[0-9]?\\.[0-9][0-9]?[0-9]?$" ) ) {
    return 4;
  }

  return 0;
}
// ----------------------------------------------------------------------
// ----------------------------------------------------------------------

function translateError(err) {
  if ( err instanceof org.vertx.java.core.dns.DnsException ) {
    var c = err.code().code();
    if ( c == 3 ) {
      return process.binding('uv').UV_EAI_NODATA;
    }
    return c;
  }

  return err.toString();
}

// ----------------------------------------------------------------------
// getaddrinfo
// ----------------------------------------------------------------------

cares.getaddrinfo = function(req,name,family) {
  if ( ! ( this instanceof cares.getaddrinfo ) ) {
    new cares.getaddrinfo(req,name,family);
    return;
  }
  if ( family == 4 ) {
    this._query = new io.nodyn.dns.GetAddrInfo4Wrap(process._process, name);
  } else {
    this._query = new io.nodyn.dns.GetAddrInfo6Wrap(process._process, name);
  }
  this._query.on( "complete", function(result) {
    if ( result.error ) {
      req.oncomplete( translateError( result.error ) );
    } else {
      var addr = result.result;
      var family = ( addr instanceof java.net.Inet4Address ? 4 : 6 );
      req.oncomplete( undefined, [ result.result.hostAddress ], family );
    }
  });
  this._query.start();
}


// ----------------------------------------------------------------------
// A
// ----------------------------------------------------------------------

cares.queryA = function(req,name) {
  if ( ! ( this instanceof cares.queryA ) ) {
    new cares.queryA(req,name);
    return;
  }
  this._query = new io.nodyn.dns.QueryAWrap(process._process, name);
  this._query.on( "complete", function(result) {
    if ( result.error ) {
      req.oncomplete( result.error.toString() );
    } else {
      var a = [];
      var iter = result.result.iterator();
      while (iter.hasNext()) {
        a.push( iter.next().hostAddress );
      }
      req.oncomplete(undefined, a);
    }
  });
  this._query.start();
}

// ----------------------------------------------------------------------
// AAAA
// ----------------------------------------------------------------------

cares.queryAaaa = function(req,name) {
  if ( ! ( this instanceof cares.queryAaaa ) ) {
    new cares.queryAaaa(req,name);
    return;
  }
  this._query = new io.nodyn.dns.QueryAaaaWrap(process._process, name);
  this._query.on( "complete", function(result) {
    if ( result.error ) {
      req.oncomplete( result.error.toString() );
    } else {
      var a = [];
      var iter = result.result.iterator();
      while (iter.hasNext()) {
        a.push( iter.next().hostAddress );
      }
      req.oncomplete(undefined, a);
    }
  });
  this._query.start();
}

// ----------------------------------------------------------------------
// MX
// ----------------------------------------------------------------------

cares.queryMx = function(req,name) {
  if ( ! ( this instanceof cares.queryMx ) ) {
    new cares.queryMx(req,name);
    return;
  }
  this._query = new io.nodyn.dns.QueryMxWrap(process._process, name);
  this._query.on( "complete", function(result) {
    if ( result.error ) {
      req.oncomplete( result.error.toString() );
    } else {
      var a = [];
      var iter = result.result.iterator();
      while (iter.hasNext()) {
        var each = iter.next();
        a.push( {
          exchange: each.name(),
          priority: each.priority(),
        } );
      }
      req.oncomplete(undefined, a);
    }
  });
  this._query.start();
}

// ----------------------------------------------------------------------
// TXT
// ----------------------------------------------------------------------

cares.queryTxt = function(req,name) {
  if ( ! ( this instanceof cares.queryTxt ) ) {
    new cares.queryTxt(req,name);
    return;
  }
  this._query = new io.nodyn.dns.QueryTxtWrap(process._process, name);
  this._query.on( "complete", function(result) {
    if ( result.error ) {
      req.oncomplete( result.error.toString() );
    } else {
      var a = [];
      var iter = result.result.iterator();
      while (iter.hasNext()) {
        var each = iter.next();
        a.push( each );
      }
      req.oncomplete(undefined, a);
    }
  });
  this._query.start();
}

// ----------------------------------------------------------------------
// SRV
// ----------------------------------------------------------------------

cares.querySrv = function(req,name) {
  if ( ! ( this instanceof cares.querySrv ) ) {
    new cares.querySrv(req,name);
    return;
  }
  this._query = new io.nodyn.dns.QuerySrvWrap(process._process, name);
  this._query.on( "complete", function(result) {
    if ( result.error ) {
      req.oncomplete( result.error.toString() );
    } else {
      var a = [];
      var iter = result.result.iterator();
      while (iter.hasNext()) {
        var each = iter.next();
        a.push( {
          name:     each.target(),
          port:     each.port(),
          priority: each.priority(),
          weight:   each.weight(),
        } );
      }
      req.oncomplete(undefined, a);
    }
  });
  this._query.start();
}

// ----------------------------------------------------------------------
// NS
// ----------------------------------------------------------------------

cares.queryNs = function(req,name) {
  if ( ! ( this instanceof cares.queryNs ) ) {
    new cares.queryNs(req,name);
    return;
  }
  this._query = new io.nodyn.dns.QueryNsWrap(process._process, name);
  this._query.on( "complete", function(result) {
    if ( result.error ) {
      req.oncomplete( result.error.toString() );
    } else {
      var a = [];
      var iter = result.result.iterator();
      while (iter.hasNext()) {
        var each = iter.next();
        a.push( each );
      }
      req.oncomplete(undefined, a);
    }
  });
  this._query.start();
}

// ----------------------------------------------------------------------
// CNAME
// ----------------------------------------------------------------------

cares.queryCname = function(req,name) {
  if ( ! ( this instanceof cares.queryCname ) ) {
    new cares.queryCname(req,name);
    return;
  }
  this._query = new io.nodyn.dns.QueryCnameWrap(process._process, name);
  this._query.on( "complete", function(result) {
    if ( result.error ) {
      req.oncomplete( result.error.toString() );
    } else {
      var a = [];
      var iter = result.result.iterator();
      while (iter.hasNext()) {
        var each = iter.next();
        a.push( each );
      }
      req.oncomplete(undefined, a);
    }
  });
  this._query.start();
}

// ----------------------------------------------------------------------
// Reverse
// ----------------------------------------------------------------------

cares.getHostByAddr = function(req,name) {
  if ( ! ( this instanceof cares.getHostByAddr ) ) {
    new cares.getHostByAddr(req,name);
    return;
  }
  this._query = new io.nodyn.dns.GetHostByAddrWrap(process._process, name);
  this._query.on( "complete", function(result) {
    if ( result.error ) {
      req.oncomplete( result.error.toString() );
    } else {
      req.oncomplete(undefined, [ result.result.hostName ] );
    }
  });
  this._query.start();
}

// ----------------------------------------------------------------------


module.exports = cares;