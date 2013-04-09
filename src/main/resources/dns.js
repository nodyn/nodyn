
var DNS = function() {
  var that = this;

  that.lookup = function() {}
  that.resolve = function() {}
  that.resolve4 = function() {}
  that.resolve6 = function() {}
  that.resolveMx = function() {}
  that.resolveTxt = function() {}
  that.resolveSrv = function() {}
  that.resolveNs = function() {}
  that.resolveCname = function() {}
  that.reverse = function() {}

  that.NODATA = 'ENODATA';
  that.FORMERR = 'EFORMERR';
  that.SERVFAIL = 'ESERVFAIL';
  that.NOTFOUND = 'ENOTFOUND';
  that.NOTIMP = 'ENOTIMP';
  that.REFUSED = 'EREFUSED';
  that.BADQUERY = 'EBADQUERY';
  that.ADNAME = 'EADNAME';
  that.BADFAMILY = 'EBADFAMILY';
  that.BADRESP = 'EBADRESP';
  that.CONNREFUSED = 'ECONNREFUSED';
  that.TIMEOUT = 'ETIMEOUT';
  that.EOF = 'EOF';
  that.FILE = 'EFILE';
  that.NOMEM = 'ENOMEM';
  that.DESTRUCTION = 'EDESTRUCTION';
  that.BADSTR = 'EBADSTR';
  that.BADFLAGS = 'EBADFLAGS';
  that.NONAME = 'ENONAME';
  that.BADHINTS = 'EBADHINTS';
  that.NOTINITIALIZED = 'ENOTINITIALIZED';
  that.LOADIPHLPAPI = 'ELOADIPHLPAPI';
  that.ADDRGETNETWORKPARAMS = 'EADDRGETNETWORKPARAMS';
  that.CANCELLED = 'ECANCELLED';
}

module.exports = exports = new DNS();
