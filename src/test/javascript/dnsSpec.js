var helper     = require('specHelper');
var dns        = require('dns');
describe('The dns module', function() {

  var server     = null; // server instance set in prepareDns
  var DnsServer  = org.projectodd.nodyn.dns.TestDnsServer;

  beforeEach(function() {
    helper.testComplete(false);
  });

  afterEach(function() {
    stop();
  });

  it('should pass testLookup', function() {
    var ip = '10.0.0.1';
    waitsFor(helper.testComplete, "the dns lookup test to complete", 100);
    prepareDns(DnsServer.testResolveA(ip), function() {
      dns.lookup("nodyn.io", function(err, address, family) {
        expect("Unexpected error: " + err, err === null).toBeTruthy();
        expect("Address should not be null", address !== null).toBeTruthy();
        expect("Unexpected address: " + address, ip === address).toBeTruthy();
        expect("Family should be set.", family !== null).toBeTruthy();
        expect("Family should be a number.", typeof family === 'number').toBeTruthy();
        helper.testComplete(true);
      });
    });
  });

  it('should pass testResolve', function() {
    var ip = '10.0.0.1';
    waitsFor(helper.testComplete, "the dns resolve test to complete", 100);
    prepareDns(DnsServer.testResolveA(ip), function() {
      dns.resolve("nodyn.io", function(err, addresses) {
        expect("Unexpected error: " + err, err === null).toBeTruthy();
        expect("Address should not be null", addresses !== null).toBeTruthy();
        expect("Unexpected address: " + addresses, ip === addresses[0]).toBeTruthy();
        helper.testComplete(true);
      });
    });
  });

  it('should pass testResolve4', function() {
    var ip = '10.0.0.1';
    waitsFor(helper.testComplete, "the dns resolve4 test to complete", 100);
    prepareDns(DnsServer.testResolveA(ip), function() {
      dns.resolve4("nodyn.io", function(err, addresses) {
        expect("Unexpected error: " + err, err === null).toBeTruthy();
        expect("Address should not be null", addresses !== null).toBeTruthy();
        expect("Unexpected address: " + addresses, ip === addresses[0]).toBeTruthy();
        helper.testComplete(true);
      });
    });
  });

  it('should pass testResolve6', function() {
    var ip = '::1';
    waitsFor(helper.testComplete, "the dns resolve6 test to complete", 100);
    prepareDns(DnsServer.testResolveAAAA(ip), function() {
      dns.resolve6("nodyn.io", function(err, addresses) {
        expect("Unexpected error: " + err, err === null).toBeTruthy();
        expect("Address should not be null", addresses !== null).toBeTruthy();
        expect("Unexpected address: " + addresses, '0:0:0:0:0:0:0:1' === addresses[0]).toBeTruthy();
        helper.testComplete(true);
      });
    });
  });

  it('should pass testResolveMx', function() {
    var prio = 10,
        name = "mail.nodyn.io";
    waitsFor(helper.testComplete, "the dns resolveMX test to complete", 100);
    prepareDns(DnsServer.testResolveMX(prio, name), function() {
      dns.resolveMx("nodyn.io", function(err, records) {
        expect("Unexpected error: " + err, err === null).toBeTruthy();
        expect("Unexpected priority: " + records[0], prio == records[0].priority).toBeTruthy();
        expect("Unexpected exchange: " + records[0], name === records[0].exchange).toBeTruthy();
        helper.testComplete(true);
      });
    });
  });

  it('should pass testResolveTxt', function() {
    var txt = "vert.x is awesome";
    waitsFor(helper.testComplete, "the dns resolveTxt test to complete", 100);
    prepareDns(DnsServer.testResolveTXT(txt), function() {
      dns.resolveTxt("nodyn.io", function(err, records) {
        expect("Unexpected number of response records: " + records.length,
          1 === records.length).toBeTruthy();
        expect("Unexpected result: " + records[0], txt === records[0]).toBeTruthy();
        helper.testComplete(true);
      });
    });
  });

  it('should pass testResolveSrv', function() {
    var prio = 10,
        weight = 1,
        port = 80,
        target = 'nodyn.io';
    waitsFor(helper.testComplete, "the dns resolveSrv test to complete", 100);
    prepareDns(DnsServer.testResolveSRV(prio, weight, port, target), function() {
      dns.resolveSrv("nodyn.io", function(err, records) {
        expect(records).toBeTruthy();
        record = records[0];
        expect("Unexpected value: " + record.priority, prio == record.priority).toBeTruthy();
        expect("Unexpected value: " + record.weight, weight == record.weight).toBeTruthy();
        expect("Unexpected value: " + record.port, port == record.port).toBeTruthy();
        expect("Unexpected address: " + record.target, target === record.target).toBeTruthy();
        helper.testComplete(true);
      });
    });
  });

  it('should pass testResolveNs', function() {
    var ns = 'ns.nodyn.io';
    waitsFor(helper.testComplete, "the dns resolveNs test to complete", 100);
    prepareDns(DnsServer.testResolveNS(ns), function() {
      dns.resolveNs("nodyn.io", function(err, records) {
        expect("Unexpected number of response records: " + records.length,
          1 === records.length).toBeTruthy();
        expect("Unexpected result: " + records[0], ns === records[0]).toBeTruthy();
        helper.testComplete(true);
      });
    });
  });

  it('should pass testResolveCname', function() {
    var cname = "cname.nodyn.io";
    waitsFor(helper.testComplete, "the dns resolveCname test to complete", 100);
    prepareDns(DnsServer.testResolveCNAME(cname), function() {
      dns.resolveCname("nodyn.io", function(err, records) {
        expect(records).toBeTruthy();
        expect("Unexpected address: " + records, cname === records[0]).toBeTruthy();
        helper.testComplete(true);
      });
    });
  });

  it('should pass testReverseLookupIPv4', function() {
    var ptr = 'ptr.nodyn.io';
    waitsFor(helper.testComplete, "the dns reverse lookup IPv4 test to complete", 100);
    prepareDns(DnsServer.testReverseLookup(ptr), function() {
      dns.reverse('10.0.0.1', function(err, records) {
        expect(records).toBeTruthy();
        expect("Unexpected address: " + records[0], records[0] === ptr).toBeTruthy();
        helper.testComplete(true);
      });
    });
  });

  it('should pass testReverseLookupIPv6', function() {
    var ptr = 'ptr.nodyn.io';
    waitsFor(helper.testComplete, "the dns reverse lookup IPv6 test to complete", 100);
    prepareDns(DnsServer.testReverseLookup(ptr), function() {
      dns.reverse('::1', function(err, records) {
        expect(records).toBeTruthy();
        expect("Unexpected address: " + records[0], records[0] === ptr).toBeTruthy();
        helper.testComplete(true);
      });
    });
  });

  it('should pass testResolveRrtypeA', function() {
    var ip = '10.0.0.1';
    waitsFor(helper.testComplete, "the dns resolve A test to complete", 100);
    prepareDns(DnsServer.testResolveA(ip), function() {
      dns.resolve("nodyn.io", 'A', function(err, addresses) {
        expect("Unexpected error: " + err, err === null).toBeTruthy();
        expect("Address should not be null", addresses !== null).toBeTruthy();
        expect("Unexpected address: " + addresses, ip === addresses[0]).toBeTruthy();
        helper.testComplete(true);
      });
    });
  });

  it('should pass testResolveRrtypeAAAA', function() {
    var ip = '::1';
    waitsFor(helper.testComplete, "the dns resolve AAAA test to complete", 100);
    prepareDns(DnsServer.testResolveAAAA(ip), function() {
      dns.resolve("nodyn.io", 'AAAA', function(err, addresses) {
        expect("Unexpected error: " + err, err === null).toBeTruthy();
        expect("Address should not be null", addresses !== null).toBeTruthy();
        expect("Unexpected address: " + addresses, '0:0:0:0:0:0:0:1' === addresses[0]).toBeTruthy();
        helper.testComplete(true);
      });
    });
  });

  it('should pass testResolveRrtypeMx', function() {
    var prio = 10,
        name = "mail.nodyn.io";
    waitsFor(helper.testComplete, "the dns resolve mx test to complete", 100);
    prepareDns(DnsServer.testResolveMX(prio, name), function() {
      dns.resolve("nodyn.io", 'MX', function(err, records) {
        expect("Unexpected error: " + err, err === null).toBeTruthy();
        expect("Unexpected priority: " + records[0], prio == records[0].priority).toBeTruthy();
        expect("Unexpected exchange: " + records[0], name === records[0].exchange).toBeTruthy();
        helper.testComplete(true);
      });
    });
  });

  it('should pass testResolveRrtypeTxt', function() {
    var txt = "vert.x is awesome";
    waitsFor(helper.testComplete, "the dns resolve txt test to complete", 100);
    prepareDns(DnsServer.testResolveTXT(txt), function() {
      dns.resolve("nodyn.io", 'TXT', function(err, records) {
        expect("Unexpected number of response records: " + records.length,
          1 === records.length).toBeTruthy() ;
        expect("Unexpected result: " + records[0], txt === records[0]).toBeTruthy();
        helper.testComplete(true);
      });
    });
  });

  it('should pass testResolveRrtypeSrv', function() {
    var prio = 10,
        weight = 1,
        port = 80,
        target = 'nodyn.io';
    waitsFor(helper.testComplete, "the dns resolve srv test to complete", 100);
    prepareDns(DnsServer.testResolveSRV(prio, weight, port, target), function() {
      dns.resolve("nodyn.io", 'SRV', function(err, records) {
        expect(records).toBeTruthy();
        record = records[0];
        expect("Unexpected value: " + record.priority, prio == record.priority).toBeTruthy();
        expect("Unexpected value: " + record.weight, weight == record.weight).toBeTruthy();
        expect("Unexpected value: " + record.port, port == record.port).toBeTruthy();
        expect("Unexpected address: " + record.target, target === record.target).toBeTruthy();
        helper.testComplete(true);
      });
    });
  });

  it('should pass testResolveRrtypeNs', function() {
    var ns = 'ns.nodyn.io';
    waitsFor(helper.testComplete, "the dns resolve ns test to complete", 100);
    prepareDns(DnsServer.testResolveNS(ns), function() {
      dns.resolve("nodyn.io", 'NS', function(err, records) {
        expect("Unexpected number of response records: " + records.length,
          1 === records.length).toBeTruthy();
        expect("Unexpected result: " + records[0], ns === records[0]).toBeTruthy();
        helper.testComplete(true);
      });
    });
  });

  it('should pass testResolveRrtypeCname', function() {
    var cname = "cname.nodyn.io";
    waitsFor(helper.testComplete, "the dns resolve cname test to complete", 100);
    prepareDns(DnsServer.testResolveCNAME(cname), function() {
      dns.resolve("nodyn.io", 'CNAME', function(err, records) {
        expect(records).toBeTruthy();
        expect("Unexpected address: " + records, cname === records[0]).toBeTruthy();
        helper.testComplete(true);
      });
    });
  });

  it('should pass testLookupNonexisting', function() {
    waitsFor(helper.testComplete, "the dns lookup nonexisting domain test to complete", 100);
    prepareDns(DnsServer.testLookupNonExisting(), function() {
      dns.lookup("asdfadsf.com", function(err, address) {
        expect(err).toBeTruthy();
        expect(err.code).toBe(dns.NOTFOUND);
        helper.testComplete(true);
      });
    });
  });

  function stop() {
    if (server) {
      server.stop();
    }
  }

  function prepareDns(srv, testFunc) {
    server = srv;
    server.start();
    dns.server({host: '127.0.0.1', port: 53530});
    testFunc.apply(testFunc);
  }
});
