var nodyn = require('nodyn');

function errorConverter(err) {
  if (err) {
    err.code = err.cause.code().name();
    // TODO: Convert other errors to node.js names
    if(err.code === 'NXDOMAIN') {
      err.code = DNS.NOTFOUND;
    }
    return err;
  }
  return null;
}

function stringMutator(list) {
  if (!list) return null;
  return list.toArray();
}
function stringHandler(callback) {
  return nodyn.vertxHandler(function(e,r) {
    callback(errorConverter(e), stringMutator(r));
  });
}

function addressMutator(addresses) {
  if (!addresses) return null;
  var addrs = [];
  for (var i = 0; i < addresses.size(); i++) {
    addrs[i] = addresses.get(i).getHostAddress();
  }
  return addrs;
}
function addressHandler(callback) {
  return nodyn.vertxHandler(function(e,r) {
    callback(errorConverter(e), addressMutator(r));
  });
}

function mxMutator(records) {
  if (!records) return null;
  var recs = [];
  for (var i = 0; i < records.size(); i++) {
    recs[i] = {
      priority: records.get(i).priority(),
      exchange: records.get(i).name()
    };
  }
  return recs;
}
function mxHandler(callback) {
  return nodyn.vertxHandler(function(e,r) {
    callback(errorConverter(e), mxMutator(r));
  });
}

function srvMutator(records) {
  if (!records) return null;
  var recs = [];
  for (var i = 0; i < records.size(); i++) {
    var record = records.get(i);
    recs[i] = {
      priority: record.priority(),
      weight: record.weight(),
      port: record.port(),
      name: record.name(),
      protocol: record.protocol(),
      service: record.service(),
      target: record.target()
    };
  }
  return recs;
}
function srvHandler(callback) {
  return nodyn.vertxHandler(function(e,r) {
    callback(errorConverter(e), srvMutator(r));
  });
}

function serverAddress(srv) {
  return [new java.net.InetSocketAddress(java.net.InetAddress.getByName(srv.host), srv.port)];
}

var client = process.context.createDnsClient(serverAddress({host: '127.0.0.1', port: 53})),
    DNS = {};

DNS.NODATA = 'ENODATA';
DNS.FORMERR = 'EFORMERR';
DNS.SERVFAIL = 'ESERVFAIL';
DNS.NOTFOUND = 'ENOTFOUND';
DNS.NOTIMP = 'ENOTIMP';
DNS.REFUSED = 'EREFUSED';
DNS.BADQUERY = 'EBADQUERY';
DNS.ADNAME = 'EADNAME';
DNS.BADFAMILY = 'EBADFAMILY';
DNS.BADRESP = 'EBADRESP';
DNS.CONNREFUSED = 'ECONNREFUSED';
DNS.TIMEOUT = 'ETIMEOUT';
DNS.EOF = 'EOF';
DNS.FILE = 'EFILE';
DNS.NOMEM = 'ENOMEM';
DNS.DESTRUCTION = 'EDESTRUCTION';
DNS.BADSTR = 'EBADSTR';
DNS.BADFLAGS = 'EBADFLAGS';
DNS.NONAME = 'ENONAME';
DNS.BADHINTS = 'EBADHINTS';
DNS.NOTINITIALIZED = 'ENOTINITIALIZED';
DNS.LOADIPHLPAPI = 'ELOADIPHLPAPI';
DNS.ADDRGETNETWORKPARAMS = 'EADDRGETNETWORKPARAMS';
DNS.CANCELLED = 'ECANCELLED';

/**
 * Sets the nameserver address and port
 * {
 *   host: '127.0.0.1',
 *   port: 53530
 * }
 */
DNS.server = function server(srv) {
  if (srv) {
    client = process.context.createDnsClient(serverAddress(srv));
  }
};


DNS.lookup = function lookup(domain, family, callback) {
  if (typeof family === 'function') {
    callback = family;
    family = 4;
  }
  var handler = nodyn.vertxHandler(function(e,r) {
    callback(errorConverter(e), (r ? r.toString() : null), family);
  });

  if (family === 4) {
    client.lookup4(domain, handler);
  } else if (family === 6) {
    client.lookup6(domain, handler);
  }
};

DNS.resolve = function resolve(domain, rrtype, callback) {
  if (typeof rrtype == 'function') {
    callback = rrtype;
    rrtype = 'A';
  }

  switch(rrtype) {
    case 'A': {
      client.resolveA(domain, addressHandler(callback));
      break;
    }
    case 'AAAA': {
      client.resolveAAAA(domain, addressHandler(callback));
      break;
    }
    case 'CNAME': {
      client.resolveCNAME(domain, stringHandler(callback));
      break;
    }
    case 'MX': {
      client.resolveMX(domain, mxHandler(callback));
      break;
    }
    case 'NS': {
      client.resolveNS(domain, stringHandler(callback));
      break;
    }
    case 'PTR': {
      client.resolvePTR(domain, nodyn.vertxHandler(callback));
      break;
    }
    case 'SRV': {
      client.resolveSRV(domain, srvHandler(callback));
      break;
    }
    case 'TXT': {
      client.resolveTXT(domain, stringHandler(callback));
      break;
    }
    default: {
      callback({code: DNS.BADQUERY});
    }
  }
};

DNS.resolve4 = function resolve4(domain, callback) {
  DNS.resolve(domain, 'A', callback);
};

DNS.resolve6 = function resolve6(domain, callback) {
  DNS.resolve(domain, 'AAAA', callback);
};

DNS.resolveMx = function resolveMx(domain, callback) {
  DNS.resolve(domain, 'MX', callback);
};

DNS.resolveTxt = function(domain, callback) {
  DNS.resolve(domain, 'TXT', callback);
};

DNS.resolveSrv = function(domain, callback) {
  DNS.resolve(domain, 'SRV', callback);
};

DNS.resolveNs = function(domain, callback) {
  DNS.resolve(domain, 'NS', callback);
};

DNS.resolveCname = function(domain, callback) {
  DNS.resolve(domain, 'CNAME', callback);
};

DNS.reverse = function(ip, callback) {
  DNS.resolve(ip, 'PTR', callback);
};

module.exports = DNS;
