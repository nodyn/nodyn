load('vertx.js');
load('vertx_tests.js');

function testStdOut() {
  vassert.assertEquals(typeof process.stdout, 'object');
  vassert.assertTrue(typeof process.stdout.write == 'function');
  vassert.testComplete();
}

function testStdErr() {
  vassert.assertEquals(typeof process.stderr, 'object');
  vassert.assertTrue(typeof process.stderr.write == 'function');
  vassert.testComplete();
}

function testExecPath() {
  vassert.assertEquals(java.lang.System.getProperty('user.dir'), process.execPath);
  vassert.testComplete();
}

function testArch() {
  vassert.assertEquals('java', process.arch);
  vassert.testComplete();
}

function testPlatform() {
  vassert.assertEquals('java', process.platform);
  vassert.testComplete();
}

function testProcessEvents() {
  java.lang.System.out.println("BUFFER: " + Buffer);
  vassert.assertEquals('function', typeof process.addListener);
  vassert.testComplete();
}

initTests(this);
