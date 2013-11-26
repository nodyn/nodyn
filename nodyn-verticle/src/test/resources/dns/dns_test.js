var vertxTest  = require('vertx_tests');
var vassert    = vertxTest.vassert;
var dns        = require('dns');
var server     = null; // server instance set in prepareDns
var DnsServer  = org.vertx.testtools.TestDnsServer;

var prepareDns = function(srv, testFunc) {
  server = srv;
  server.start();
  dns.server({host: '127.0.0.1', port: 53530});
  testFunc.apply(testFunc);
};

vertxStop = function() {
  if (server) {
    server.stop();
  }
};

var DnsTests = {
  testLookup: function() {
    var ip = '10.0.0.1';
    prepareDns(DnsServer.testResolveA(ip), function() {
      dns.lookup("vertx.io", function(err, address, family) {
        vassert.assertTrue("Unexpected error: " + err, err === null);
        vassert.assertTrue("Address should not be null", address !== null);
        vassert.assertTrue("Unexpected address: " + address, ip === address);
        vassert.assertTrue("Family should be set.", family !== null);
        vassert.assertTrue("Family should be a number.", typeof family === 'number');
        vassert.testComplete();
      });
    });
  },

  testResolve: function() {
    var ip = '10.0.0.1';
    prepareDns(DnsServer.testResolveA(ip), function() {
      dns.resolve("vertx.io", function(err, addresses) {
        vassert.assertTrue("Unexpected error: " + err, err === null);
        vassert.assertTrue("Address should not be null", addresses !== null);
        vassert.assertTrue("Unexpected address: " + addresses, ip === addresses[0]);
        vassert.testComplete();
      });
    });
  },

  testResolve4: function() {
    var ip = '10.0.0.1';
    prepareDns(DnsServer.testResolveA(ip), function() {
      dns.resolve4("vertx.io", function(err, addresses) {
        vassert.assertTrue("Unexpected error: " + err, err === null);
        vassert.assertTrue("Address should not be null", addresses !== null);
        vassert.assertTrue("Unexpected address: " + addresses, ip === addresses[0]);
        vassert.testComplete();
      });
    });
  },

  testResolve6: function() {
    var ip = '::1';
    prepareDns(DnsServer.testResolveAAAA(ip), function() {
      dns.resolve6("vertx.io", function(err, addresses) {
        vassert.assertTrue("Unexpected error: " + err, err === null);
        vassert.assertTrue("Address should not be null", addresses !== null);
        vassert.assertTrue("Unexpected address: " + addresses, '0:0:0:0:0:0:0:1' === addresses[0]);
        vassert.testComplete();
      });
    });
  },

  testResolveMx: function() {
    var prio = 10,
        name = "mail.vertx.io";
    prepareDns(DnsServer.testResolveMX(prio, name), function() {
      dns.resolveMx("vertx.io", function(err, records) {
        vassert.assertTrue("Unexpected error: " + err, err === null);
        vassert.assertTrue("Unexpected priority: " + records[0], prio == records[0].priority);
        vassert.assertTrue("Unexpected exchange: " + records[0], name === records[0].exchange);
        vassert.testComplete();
      });
    });
  },

  testResolveTxt: function() {
    var txt = "vert.x is awesome";
    prepareDns(DnsServer.testResolveTXT(txt), function() {
      dns.resolveTxt("vertx.io", function(err, records) {
        vassert.assertTrue("Unexpected number of response records: " + records.length, 
          1 === records.length);
        vassert.assertTrue("Unexpected result: " + records[0], txt === records[0]);
        vassert.testComplete();
      });
    });
  },

  testResolveSrv: function() {
    var prio = 10,
        weight = 1,
        port = 80,
        target = 'vertx.io';
    prepareDns(DnsServer.testResolveSRV(prio, weight, port, target), function() {
      dns.resolveSrv("vertx.io", function(err, records) {
        vassert.assertNotNull(records);
        record = records[0];
        vassert.assertTrue("Unexpected value: " + record.priority, prio == record.priority);
        vassert.assertTrue("Unexpected value: " + record.weight, weight == record.weight);
        vassert.assertTrue("Unexpected value: " + record.port, port == record.port);
        vassert.assertTrue("Unexpected address: " + record.target, target === record.target);
        vassert.testComplete();
      });
    });
  },

  testResolveNs: function() {
    var ns = 'ns.vertx.io';
    prepareDns(DnsServer.testResolveNS(ns), function() {
      dns.resolveNs("vertx.io", function(err, records) {
        vassert.assertTrue("Unexpected number of response records: " + records.length, 
          1 === records.length);
        vassert.assertTrue("Unexpected result: " + records[0], ns === records[0]);
        vassert.testComplete();
      });
    });
  },

  testResolveCname: function() {
    var cname = "cname.vertx.io";
    prepareDns(DnsServer.testResolveCNAME(cname), function() {
      dns.resolveCname("vertx.io", function(err, records) {
        vassert.assertNotNull(records);
        vassert.assertTrue("Unexpected address: " + records, cname === records[0]);
        vassert.testComplete();
      });
    });
  },

  testReverseLookupIPv4: function() {
    var ptr = 'ptr.vertx.io';
    prepareDns(DnsServer.testReverseLookup(ptr), function() {
      dns.reverse('10.0.0.1', function(err, records) {
        vassert.assertNotNull(records);
        vassert.assertTrue("Unexpected address: " + records[0], records[0] === ptr);
        vassert.testComplete();
      });
    });
  },

  testReverseLookupIPv6: function() {
    var ptr = 'ptr.vertx.io';
    prepareDns(DnsServer.testReverseLookup(ptr), function() {
      dns.reverse('::1', function(err, records) {
        vassert.assertNotNull(records);
        vassert.assertTrue("Unexpected address: " + records[0], records[0] === ptr);
        vassert.testComplete();
      });
    });
  },

  testResolveRrtypeA: function() {
    var ip = '10.0.0.1';
    prepareDns(DnsServer.testResolveA(ip), function() {
      dns.resolve("vertx.io", 'A', function(err, addresses) {
        vassert.assertTrue("Unexpected error: " + err, err === null);
        vassert.assertTrue("Address should not be null", addresses !== null);
        vassert.assertTrue("Unexpected address: " + addresses, ip === addresses[0]);
        vassert.testComplete();
      });
    });
  },

  testResolveRrtypeAAAA: function() {
    var ip = '::1';
    prepareDns(DnsServer.testResolveAAAA(ip), function() {
      dns.resolve("vertx.io", 'AAAA', function(err, addresses) {
        vassert.assertTrue("Unexpected error: " + err, err === null);
        vassert.assertTrue("Address should not be null", addresses !== null);
        vassert.assertTrue("Unexpected address: " + addresses, '0:0:0:0:0:0:0:1' === addresses[0]);
        vassert.testComplete();
      });
    });
  },

  testResolveRrtypeMx: function() {
    var prio = 10,
        name = "mail.vertx.io";
    prepareDns(DnsServer.testResolveMX(prio, name), function() {
      dns.resolve("vertx.io", 'MX', function(err, records) {
        vassert.assertTrue("Unexpected error: " + err, err === null);
        vassert.assertTrue("Unexpected priority: " + records[0], prio == records[0].priority);
        vassert.assertTrue("Unexpected exchange: " + records[0], name === records[0].exchange);
        vassert.testComplete();
      });
    });
  },

  testResolveRrtypeTxt: function() {
    var txt = "vert.x is awesome";
    prepareDns(DnsServer.testResolveTXT(txt), function() {
      dns.resolve("vertx.io", 'TXT', function(err, records) {
        vassert.assertTrue("Unexpected number of response records: " + records.length, 
          1 === records.length);
        vassert.assertTrue("Unexpected result: " + records[0], txt === records[0]);
        vassert.testComplete();
      });
    });
  },

  testResolveRrtypeSrv: function() {
    var prio = 10,
        weight = 1,
        port = 80,
        target = 'vertx.io';
    prepareDns(DnsServer.testResolveSRV(prio, weight, port, target), function() {
      dns.resolve("vertx.io", 'SRV', function(err, records) {
        vassert.assertNotNull(records);
        record = records[0];
        vassert.assertTrue("Unexpected value: " + record.priority, prio == record.priority);
        vassert.assertTrue("Unexpected value: " + record.weight, weight == record.weight);
        vassert.assertTrue("Unexpected value: " + record.port, port == record.port);
        vassert.assertTrue("Unexpected address: " + record.target, target === record.target);
        vassert.testComplete();
      });
    });
  },

  testResolveRrtypeNs: function() {
    var ns = 'ns.vertx.io';
    prepareDns(DnsServer.testResolveNS(ns), function() {
      dns.resolve("vertx.io", 'NS', function(err, records) {
        vassert.assertTrue("Unexpected number of response records: " + records.length, 
          1 === records.length);
        vassert.assertTrue("Unexpected result: " + records[0], ns === records[0]);
        vassert.testComplete();
      });
    });
  },

  testResolveRrtypeCname: function() {
    var cname = "cname.vertx.io";
    prepareDns(DnsServer.testResolveCNAME(cname), function() {
      dns.resolve("vertx.io", 'CNAME', function(err, records) {
        vassert.assertNotNull(records);
        vassert.assertTrue("Unexpected address: " + records, cname === records[0]);
        vassert.testComplete();
      });
    });
  },

  testLookupNonexisting: function() {
    prepareDns(DnsServer.testLookupNonExisting(), function() {
      dns.lookup("asdfadsf.com", function(err, address) {
        vassert.assertNotNull(err);
        vassert.assertEquals(dns.NOTFOUND, err.code);
        vassert.testComplete();
      });
    });
  },
};

vertxTest.startTests(DnsTests);

