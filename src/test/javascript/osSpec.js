var helper = require('specHelper');
var javaProcess = new org.projectodd.nodyn.process.Process();
var isWindows = process.platform === 'win32';
var os = require('os');

describe('OS module', function() {
  it('should pass testHostname', function() {
    expect(os.hostname()).toBe(java.net.InetAddress.getLocalHost().getHostName());
  });

  it('should pass testFreemem', function() {
    expect(os.freemem()).toBeGreaterThan(0);
   });

  it('should pass testTotalmem', function() {
    //  this is too fragile
    //  expect(os.totalmem).toBe(java.lang.Runtime.getRuntime().totalMemory());
    expect(os.totalmem()).toBeGreaterThan(0);
  });

  it('should pass testEndianness', function() {
    expect(os.endianness()).toBe("BE");
  });

  it('should pass testTmpDir', function() {
    expect(os.tmpdir()).toBe(java.lang.System.getProperty("java.io.tmpdir"));
    expect(os.tmpdir()).toBe(java.lang.System.getProperty("java.io.tmpdir"));
  });

  it('should pass testOsType', function() {
    expect(os.type()).toBe(java.lang.management.ManagementFactory.getOperatingSystemMXBean().getName());
  });

  it('should pass testOsRelease', function() {
    expect(os.release()).toBe(java.lang.management.ManagementFactory.getOperatingSystemMXBean().getVersion());
  });

  it('should pass testOsPlatform', function() {
    expect(os.platform()).toBe(javaProcess.platform());
  });

  it('should pass testUptime', function() {
    // we can't actually test the exact number here, but we can be close
    sysUptime = java.lang.management.ManagementFactory.getRuntimeMXBean().getUptime();
    nodeUptime = os.uptime();
    expect(sysUptime <= nodeUptime+500).toBe(true); // within half a second
  });

  it('should pass testLoadAvg', function() {
	// http://nodejs.org/api/os.html#os_os_loadavg - windows always returns [0, 0, 0]
    expect(3, os.loadavg().length);
    if(isWindows) {
      expect(os.loadavg()[0]).toBe(0);
      expect(os.loadavg()[1]).toBe(0);
      expect(os.loadavg()[2]).toBe(0);
    } else {
      expect(os.loadavg()[0]).toBeGreaterThan(0);
      expect(os.loadavg()[1]).toBeGreaterThan(0);
      expect(os.loadavg()[2]).toBeGreaterThan(0);
    }
  });

  it('should pass testNetworkInterfaces', function() {
    var interfaces = os.networkInterfaces();
    // Since this is so machine-specific, let's
    // just verify that the basic object structure
    // is node.js compliant...
    for (var key in interfaces) {
      var addresses = interfaces[key];
      addresses.forEach(function(a) {
        expect(a.address.constructor === String).toBe(true);
        expect(a.family.constructor === String).toBe(true);
        expect(a.internal.constructor === Boolean).toBe(true);
      });
    }
  });
});

