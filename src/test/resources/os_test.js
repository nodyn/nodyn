load('vertx_tests.js');
var os = require('os');

function testHostname() {
  vassert.assertEquals(java.net.InetAddress.getLocalHost().getHostName(), os.hostname());
  vassert.testComplete();
}

function testFreemem() {
  vassert.assertTrue(os.freemem() > 0);
  vassert.testComplete();
}

function testTotalmem() {
  //  this is too fragile
  //  vassert.assertEquals(java.lang.Runtime.getRuntime().totalMemory(), os.totalmem());
  vassert.assertTrue(os.totalmem() > 0);
  vassert.testComplete();
}

function testEndianness() {
  vassert.assertEquals("BE", os.endianness());
  vassert.testComplete();
}

function testTmpDir() {
  vassert.assertEquals(java.lang.System.getProperty("java.io.tmpdir"), os.tmpdir());
  vassert.assertEquals(java.lang.System.getProperty("java.io.tmpdir"), os.tmpDir());
  vassert.testComplete();
}

function testOsType() {
  vassert.assertEquals(java.lang.management.ManagementFactory.getOperatingSystemMXBean().getName(), os.type());
  vassert.testComplete();
}

function testOsRelease() {
  vassert.assertEquals(java.lang.management.ManagementFactory.getOperatingSystemMXBean().getVersion(), os.release());
  vassert.testComplete();
}

function testOsPlatform() {
  vassert.assertEquals("java", os.platform());
  vassert.testComplete();
}

function testUptime() {
  // we can't actually test the exact number here, but we can be close
  sysUptime = java.lang.management.ManagementFactory.getRuntimeMXBean().getUptime();
  nodeUptime = os.uptime();
  vassert.assertTrue(sysUptime <= nodeUptime+500); // within half a second
  vassert.testComplete();
}

function testLoadAvg() {
  vassert.assertEquals(3, os.loadavg().length);
  vassert.assertTrue(os.loadavg()[0] > 0);
  vassert.assertTrue(os.loadavg()[1] > 0);
  vassert.assertTrue(os.loadavg()[2] > 0);
  vassert.testComplete();
}

initTests(this);
