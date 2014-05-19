
var nativeCallback = function(callback, mutator) {
  return function(err, result) {
    if (err) {
      callback.apply(callback, [convertError(err), null]);
    } else if (typeof mutator === 'function') {
      callback.apply(callback, mutator(convertError(err), result));
    } else {
      callback.apply(callback, [convertError(err), result]);
    }
  };
};

var convertError = function(nativeError) {
  if (nativeError) {
    var err = new Error();
    err.code = nativeError.code().name();
    // TODO: Convert other errors to node.js names
    if(err.code === 'NXDOMAIN') {
      err.code = 'ENOTFOUND';
    }
    return err;
  }
  return null;
};

var serverAddress = function(srv) {
  addr = new java.net.InetSocketAddress(java.net.InetAddress.getByName(srv.host), srv.port);
  return function() {
    return addr;
  };
};

var DNS = function() {
  var dns  = NativeRequire.require('vertx/dns');
  var addr = serverAddress({host: '127.0.0.1', port: 53});

  /**
   * Sets or gets the nameserver address(es) and port
   * {
   *   host: '127.0.0.1',
   *   port: 53530
   * }
   * @param {
   */
  this.server = function(srv) {
    if (srv !== null && srv !== undefined) {
      addr = serverAddress(srv);
    }
    return addr();
  };

  this.lookup = function(domain, family, callback) {
    var client = dns.createDnsClient(addr());
    if (typeof family === 'function') {
      client.lookup(domain, nativeCallback(family, function(err, result) {
        return [err, result, 4];
      }));
    } else if (family === 4) {
      client.lookup4(domain, nativeCallback(callback, function(err, result) {
        return [err, result, family];
      }));
    } else if (family === 6) {
      client.lookup6(domain, nativeCallback(callback, function(err, result) {
        return [err, result, family];
      }));
    }
  };

  this.resolve = function(domain, rrtype, callback) {
    var client = dns.createDnsClient(addr());
    if (typeof rrtype == 'function') {
      callback = rrtype;
      rrtype = 'A';
    }
    switch(rrtype) {
      case 'A': {
        client.resolveA(domain, nativeCallback(callback));
        break;
      }
      case 'AAAA': {
        client.resolveAAAA(domain, nativeCallback(callback));
        break;
      }
      case 'CNAME': {
        client.resolveCNAME(domain, nativeCallback(callback));
        break;
      }
      case 'MX': {
        client.resolveMX(domain, nativeCallback(callback, function(err, result) {
          return [err, result.map(function(o) {
            return {'exchange': o.name, 'priority': o.priority};
          })];
        }));
        break;
      }
      case 'NS': {
        client.resolveNS(domain, nativeCallback(callback));
        break;
      }
      case 'PTR': {
        client.resolvePTR(domain, nativeCallback(callback));
        break;
      }
      case 'SRV': {
        client.resolveSRV(domain, nativeCallback(callback));
        break;
      }
      case 'TXT': {
        client.resolveTXT(domain, nativeCallback(callback));
        break;
      }
      default: {
        callback.apply(callback, [{code: this.BADQUERY}]);
      }
    }
  };

  this.resolve4 = function(domain, callback) {
    var client = dns.createDnsClient(addr());
    client.resolveA(domain, nativeCallback(callback));
  };

  this.resolve6 = function(domain, callback) {
    var client = dns.createDnsClient(addr());
    client.resolveAAAA(domain, nativeCallback(callback));
  };

  this.resolveMx = function(domain, callback) {
    var client = dns.createDnsClient(addr());
    client.resolveMX(domain, nativeCallback(callback, function(err, result) {
      return [err, result.map(function(o) {
        return {'exchange': o.name, 'priority': o.priority};
      })];
    }));
  };

  this.resolveTxt = function(domain, callback) {
    var client = dns.createDnsClient(addr());
    client.resolveTXT(domain, nativeCallback(callback));
  };

  this.resolveSrv = function(domain, callback) {
    var client = dns.createDnsClient(addr());
    client.resolveSRV(domain, nativeCallback(callback));
  };

  this.resolveNs = function(domain, callback) {
    var client = dns.createDnsClient(addr());
    client.resolveNS(domain, nativeCallback(callback));
  };

  this.resolveCname = function(domain, callback) {
    var client = dns.createDnsClient(addr());
    client.resolveCNAME(domain, nativeCallback(callback));
  };

  this.reverse = function(ip, callback) {
    var client = dns.createDnsClient(addr());
    client.reverseLookup(ip, nativeCallback(callback, function(err, result) {
      return [err, [result]];
    }));
  };

  this.NODATA = 'ENODATA';
  this.FORMERR = 'EFORMERR';
  this.SERVFAIL = 'ESERVFAIL';
  this.NOTFOUND = 'ENOTFOUND';
  this.NOTIMP = 'ENOTIMP';
  this.REFUSED = 'EREFUSED';
  this.BADQUERY = 'EBADQUERY';
  this.ADNAME = 'EADNAME';
  this.BADFAMILY = 'EBADFAMILY';
  this.BADRESP = 'EBADRESP';
  this.CONNREFUSED = 'ECONNREFUSED';
  this.TIMEOUT = 'ETIMEOUT';
  this.EOF = 'EOF';
  this.FILE = 'EFILE';
  this.NOMEM = 'ENOMEM';
  this.DESTRUCTION = 'EDESTRUCTION';
  this.BADSTR = 'EBADSTR';
  this.BADFLAGS = 'EBADFLAGS';
  this.NONAME = 'ENONAME';
  this.BADHINTS = 'EBADHINTS';
  this.NOTINITIALIZED = 'ENOTINITIALIZED';
  this.LOADIPHLPAPI = 'ELOADIPHLPAPI';
  this.ADDRGETNETWORKPARAMS = 'EADDRGETNETWORKPARAMS';
  this.CANCELLED = 'ECANCELLED';
};

module.exports = new DNS();
