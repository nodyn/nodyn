var helper     = require('./specHelper'),
    dns        = require('dns');

describe('The dns module', function() {

  var server, // server instance set in prepareDns
      DnsServer  = io.nodyn.dns.TestDnsServer;

  beforeEach(function() {
    System.setProperty( "dns.server", "127.0.0.1" );
    System.setProperty( "dns.port",   "53530" );
    io.nodyn.dns.ResolverConfig.refresh();
    helper.testComplete(false);
  });

  afterEach(function() {
    if (server) {
      server.stop();
    }
    System.clearProperty("dns.server")
    System.clearProperty("dns.port");
    io.nodyn.dns.ResolverConfig.refresh();
  });

  //dns.server({host: '127.0.0.1', port: 53530});

  function prepareDns(srv, testFunc) {
    server = srv;
    server.start();
    testFunc.apply(testFunc);
  }

  it('should pass testLookup', function() {
    var ip = '10.0.0.1';
    waitsFor(helper.testComplete, "the dns lookup test to complete", 10000);
    prepareDns(DnsServer.testResolveA(ip), function() {
      dns.lookup("nodyn.io", function(err, address, family) {
        expect( err ).toBe( null );
        expect( address ).toBe( ip );
        expect( family ).toBe( 4 );
        helper.testComplete(true);
      });
    });
  });

  it('should pass testResolve', function() {
    var ip = '10.0.0.1';
    waitsFor(helper.testComplete, "the dns resolve test to complete", 10000);
    prepareDns(DnsServer.testResolveA(ip), function() {
      dns.resolve("nodyn.io", function(err, addresses) {
        expect( err ).toBe( null );
        expect( addresses.length ).toBe( 1 );
        expect( addresses[0] ).toBe( ip );
        helper.testComplete(true);
      });
    });
  });

  it('should pass testResolve4', function() {
    var ip = '10.0.0.1';
    waitsFor(helper.testComplete, "the dns resolve4 test to complete", 10000);
    prepareDns(DnsServer.testResolveA(ip), function() {
      dns.resolve4("nodyn.io", function(err, addresses) {
        expect(err).toBe(null);
        expect( addresses.length ).toBe( 1 );
        expect( addresses[0] ).toBe( ip );
        helper.testComplete(true);
      });
    });
  });

  it('should pass testResolve6', function() {
    var ip = '::1';
    waitsFor(helper.testComplete, "the dns resolve6 test to complete", 10000);
    prepareDns(DnsServer.testResolveAAAA(ip), function() {
      dns.resolve6("nodyn.io", function(err, addresses) {
        expect(err).toBe(null);
        expect( addresses.length ).toBe( 1 );
        expect( addresses[0] ).toBe( '0:0:0:0:0:0:0:1');
        helper.testComplete(true);
      });
    });
  });

  it('should pass testResolveMx', function() {
    var prio = 10,
        name = "mail.nodyn.io";
    waitsFor(helper.testComplete, "the dns resolveMX test to complete", 10000);
    prepareDns(DnsServer.testResolveMX(prio, name), function() {
      dns.resolveMx("nodyn.io", function(err, records) {
        expect( err ).toBe( null );
        expect( records.length ).toBe( 1 );
        expect( records[0].priority ).toBe( prio );
        expect( records[0].exchange ).toBe( name );
        helper.testComplete(true);
      });
    });
  });

  it('should pass testResolveTxt', function() {
    var txt = "node.js is awesome";
    waitsFor(helper.testComplete, "the dns resolveTxt test to complete", 10000);
    prepareDns(DnsServer.testResolveTXT(txt), function() {
      dns.resolveTxt("nodyn.io", function(err, records) {
        expect( err ).toBe( null );
        expect( records.length ).toBe( 1 );
        expect( records[0] ).toBe( txt );
        helper.testComplete(true);
      });
    });
  });

  it('should pass testResolveSrv', function() {
    var prio = 10,
        weight = 1,
        port = 80,
        name = 'nodyn.io';
    waitsFor(helper.testComplete, "the dns resolveSrv test to complete", 10000);
    prepareDns(DnsServer.testResolveSRV(prio, weight, port, name), function() {
      dns.resolveSrv("nodyn.io", function(err, records) {
        expect( err ).toBe( null );
        expect( records.length ).toBe( 1 );
        expect( records[0].priority ).toBe( prio );
        expect( records[0].weight ).toBe( weight );
        expect( records[0].port ).toBe( port );
        expect( records[0].name ).toBe( name );
        helper.testComplete(true);
      });
    });
  });

  it('should pass testResolveNs', function() {
    var ns = 'ns.nodyn.io';
    waitsFor(helper.testComplete, "the dns resolveNs test to complete", 10000);
    prepareDns(DnsServer.testResolveNS(ns), function() {
      dns.resolveNs("nodyn.io", function(err, records) {
        expect( err ).toBe( null );
        expect( records.length ).toBe( 1 );
        expect( records[0] ).toBe( ns );
        helper.testComplete(true);
      });
    });
  });

  it('should pass testResolveCname', function() {
    var cname = "cname.nodyn.io";
    waitsFor(helper.testComplete, "the dns resolveCname test to complete", 10000);
    prepareDns(DnsServer.testResolveCNAME(cname), function() {
      dns.resolveCname("nodyn.io", function(err, records) {
        expect( err ).toBe( null );
        expect( records.length ).toBe( 1 );
        expect( records[0] ).toBe( cname );
        helper.testComplete(true);
      });
    });
  });

  it('should pass testReverseLookupIPv4', function() {
    var ptr = 'ptr.nodyn.io';
    waitsFor(helper.testComplete, "the dns reverse lookup IPv4 test to complete", 10000);
    prepareDns(DnsServer.testReverseLookup(ptr), function() {
      dns.reverse('10.0.0.1', function(err, records) {
        console.log( records );
        expect( err ).toBe( null );
        expect( records.length ).toBe( 1 );
        expect( records[0] ).toBe( ptr );
        helper.testComplete(true);
      });
    });
  });

  it('should pass testReverseLookupIPv6', function() {
    var ptr = 'ptr.nodyn.io';
    waitsFor(helper.testComplete, "the dns reverse lookup IPv6 test to complete", 10000);
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
    waitsFor(helper.testComplete, "the dns resolve A test to complete", 10000);
    prepareDns(DnsServer.testResolveA(ip), function() {
      dns.resolve("nodyn.io", 'A', function(err, addresses) {
        expect( err ).toBe( null );
        expect( addresses.length ).toBe( 1 );
        expect( addresses[0] ).toBe( ip );
        helper.testComplete(true);
      });
    });
  });

  it('should pass testResolveRrtypeAAAA', function() {
    var ip = '::1';
    waitsFor(helper.testComplete, "the dns resolve AAAA test to complete", 10000);
    prepareDns(DnsServer.testResolveAAAA(ip), function() {
      dns.resolve("nodyn.io", 'AAAA', function(err, addresses) {
        expect( err ).toBe( null );
        expect( addresses.length ).toBe( 1 );
        expect( addresses[0] ).toBe( '0:0:0:0:0:0:0:1' );
        helper.testComplete(true);
      });
    });
  });

  it('should pass testResolveRrtypeMx', function() {
    var prio = 10,
        name = "mail.nodyn.io";
    waitsFor(helper.testComplete, "the dns resolve mx test to complete", 10000);
    prepareDns(DnsServer.testResolveMX(prio, name), function() {
      dns.resolve("nodyn.io", 'MX', function(err, records) {
        expect( err ).toBe( null );
        expect( records.length ).toBe( 1 );
        expect( records[0].priority ).toBe( prio );
        expect( records[0].exchange ).toBe( name );
        helper.testComplete(true);
      });
    });
  });

  it('should pass testResolveRrtypeTxt', function() {
    var txt = "vert.x is awesome";
    waitsFor(helper.testComplete, "the dns resolve txt test to complete", 10000);
    prepareDns(DnsServer.testResolveTXT(txt), function() {
      dns.resolve("nodyn.io", 'TXT', function(err, records) {
        expect( err ).toBe( null );
        expect( records.length ).toBe( 1 );
        expect( records[0] ).toBe( txt );
        helper.testComplete(true);
      });
    });
  });

  it('should pass testResolveRrtypeSrv', function() {
    var prio = 10,
        weight = 1,
        port = 80,
        name = 'nodyn.io';
    waitsFor(helper.testComplete, "the dns resolve srv test to complete", 10000);
    prepareDns(DnsServer.testResolveSRV(prio, weight, port, name), function() {
      dns.resolve("nodyn.io", 'SRV', function(err, records) {
        expect( err ).toBe( null );
        expect( records.length ).toBe( 1 );
        expect( records[0].priority ).toBe( prio );
        expect( records[0].weight ).toBe( weight );
        expect( records[0].port ).toBe( port );
        expect( records[0].name ).toBe( name );
        helper.testComplete(true);
      });
    });
  });

  it('should pass testResolveRrtypeNs', function() {
    var ns = 'ns.nodyn.io';
    waitsFor(helper.testComplete, "the dns resolve ns test to complete", 10000);
    prepareDns(DnsServer.testResolveNS(ns), function() {
      dns.resolve("nodyn.io", 'NS', function(err, records) {
        expect( err ).toBe( null );
        expect( records.length ).toBe( 1 );
        expect( records[0] ).toBe( ns );
        helper.testComplete(true);
      });
    });
  });

  it('should pass testResolveRrtypeCname', function() {
    var cname = "cname.nodyn.io";
    waitsFor(helper.testComplete, "the dns resolve cname test to complete", 10000);
    prepareDns(DnsServer.testResolveCNAME(cname), function() {
      dns.resolve("nodyn.io", 'CNAME', function(err, records) {
        expect( err ).toBe( null );
        expect( records.length ).toBe( 1 );
        expect( records[0] ).toBe( cname );
        helper.testComplete(true);
      });
    });
  });

  it('should pass testLookupNonexisting', function() {
    waitsFor(helper.testComplete, "the dns lookup nonexisting domain test to complete", 10000);
    prepareDns(DnsServer.testLookupNonExisting(), function() {
      dns.lookup("asdfadsf.com", function(err, address) {
        expect(err).not.toBe( null );
        expect(err.code).toBe(dns.NOTFOUND);
        helper.testComplete(true);
      });
    });
  });

});
