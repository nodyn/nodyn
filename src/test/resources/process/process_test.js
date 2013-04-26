var vertxTest = require('vertx_tests');
var vassert   = vertxTest.vassert;
var timer     = require('vertx/timer');

function testProcessObject() {
  vassert.assertNotNull(process);
  vassert.assertEquals('object', typeof process);
  vassert.testComplete();
}

function testStdOut() {
  vassert.assertNotNull(process.stdout);
  process.stdout.write("A message to stdout");
  vassert.testComplete();
}

function testStdErr() {
  vassert.assertEquals(typeof process.stderr, 'object');
  process.stderr.write("A message to stderr");
  vassert.testComplete();
}

function testVersion() {
  vassert.assertEquals(org.projectodd.nodej.Node.VERSION, process.version);
  vassert.assertNotNull(process.versions);
  vassert.assertEquals(org.projectodd.nodej.Node.VERSION, process.versions.node);
  vassert.assertEquals(java.lang.System.getProperty("java.version"), process.versions.java);
  // Now that DynJS reports build numbers and such from version.properties,
  // this test doesn't work. E.g.
  // expected:<[0.1.0]> but was:<[v0.1.1-8-g42b66a6-dirty]>
  // vassert.assertEquals(org.dynjs.runtime.DynJS.VERSION, process.versions.dynjs);
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
  vassert.assertEquals('function', typeof process.addListener);
  vassert.testComplete();
}

function testProcessEnv() {
  vassert.assertEquals('object', typeof process.env);
  // Make sure we have a tmp dir property
  tmpDir = java.lang.System.getProperty("java.io.tmpdir");
  vassert.assertEquals(tmpDir, process.env.TMPDIR);
  vassert.assertEquals(tmpDir, process.env.TEMP);
  vassert.assertEquals(tmpDir, process.env.TMP);
  vassert.testComplete();
}

function testCWD() {
  vassert.assertEquals(java.lang.System.getProperty('user.dir'), process.cwd());
  vassert.testComplete();
}

function testPID() {
  vassert.assertEquals(java.lang.management.ManagementFactory.getRuntimeMXBean().getName(), process.pid);
  vassert.testComplete();
}

function testTitle() {
  vassert.assertEquals('NodeJ', process.title);
  vassert.testComplete();
}

function testGlobalness() {
  vassert.assertEquals(process, function() { return process; }());
  vassert.testComplete();
}

function testProcessConfig() {
  // somewhat pointless 
  // In node.js process.config returns the compile-time options of node.js
  vassert.assertNotNull(process.config);
  vassert.testComplete();
}

function testProcessEventListeners() {
  // make sure process.on and process.addListener are aliased
  vassert.assertEquals(process.on, process.addListener);
  var functionCalled = false;

  // set an event listener on 'foo'
  process.on('foo', function() { functionCalled = true }); 
  vassert.assertEquals(1, process.listeners('foo').length);
  process.emit('foo');
  vassert.assertTrue(functionCalled);

  // reset our listeners
  process.removeAllListeners('foo');
  vassert.assertEquals(0, process.listeners('foo').length);

  process.once('foo', function(str) { functionCalled = str; });
  process.emit('foo', 'bar');
  vassert.assertEquals('bar', functionCalled);

  // This event should not be fired
  process.emit('foo', 'foobar');
  vassert.assertEquals('bar', functionCalled);
  vassert.testComplete();
}

function testNextTick() {
  var x = 0;
  var f = function(y) { x += y; }
  process.nextTick(f, 10);
  timer.setTimer(100, function() {
    vassert.assertEquals(10, x);
    vassert.testComplete();
  });
}

function testMemoryUsage() {
  vassert.assertEquals('function', typeof process.memoryUsage);
  memory = process.memoryUsage();
  // TODO: Find Sigar replacement
//  vassert.assertTrue(memory.heapTotal > memory.heapUsed);
  vassert.testComplete();
}

function testUndocumentedProperties() {
  vassert.assertFalse(process.noDeprecation);
  vassert.assertFalse(process.traceDeprecation);
  vassert.testComplete();
}

vertxTest.startTests(this);
