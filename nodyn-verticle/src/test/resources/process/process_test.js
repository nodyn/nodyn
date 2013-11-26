var vertxTest = require('vertx_tests');
var vassert   = vertxTest.vassert;
var timer     = require('vertx/timer');

var javaProcess = new org.projectodd.nodyn.process.Process();

var ProcessTests = {
  testProcessObject: function() {
    vassert.assertNotNull(process);
    vassert.assertEquals('object', typeof process);
    vassert.testComplete();
  },

  testStdOut: function() {
    vassert.assertNotNull(process.stdout);
    process.stdout.write("A message to stdout");
    vassert.testComplete();
  },

  testStdErr: function() {
    vassert.assertEquals(typeof process.stderr, 'object');
    process.stderr.write("A message to stderr");
    vassert.testComplete();
  },

  testStdIn: function() {
    // TODO: Fix this
    vassert.assertEquals(typeof process.stdin, 'object');
    vassert.testComplete();
  },

  testVersion: function() {
    vassert.assertEquals(org.projectodd.nodyn.Node.VERSION, process.version);
    vassert.assertNotNull(process.versions);
    vassert.assertEquals(org.projectodd.nodyn.Node.VERSION, process.versions.node);
    vassert.assertEquals(java.lang.System.getProperty("java.version"), process.versions.java);
    // Now that DynJS reports build numbers and such from version.properties,
    // this test doesn't work. E.g.
    // expected:<[0.1.0]> but was:<[v0.1.1-8-g42b66a6-dirty]>
    // vassert.assertEquals(org.dynjs.runtime.DynJS.VERSION, process.versions.dynjs);
    vassert.testComplete();
  },

  testExecPath: function() {
    vassert.assertEquals(java.lang.System.getProperty('user.dir'), process.execPath);
    vassert.testComplete();
  },

  testArch: function() {
    vassert.assertEquals(javaProcess.arch(), process.arch);
    vassert.testComplete();
  },

  testPlatform: function() {
    vassert.assertEquals(javaProcess.platform(), process.platform);
    vassert.testComplete();
  },

  testProcessEvents: function() {
    vassert.assertEquals('function', typeof process.addListener);
    vassert.testComplete();
  },

  testProcessEnv: function() {
    vassert.assertEquals('object', typeof process.env);
    // Make sure we have a tmp dir property
    tmpDir = java.lang.System.getProperty("java.io.tmpdir");
    vassert.assertEquals(tmpDir, process.env.TMPDIR);
    vassert.assertEquals(tmpDir, process.env.TEMP);
    vassert.assertEquals(tmpDir, process.env.TMP);
    vassert.testComplete();
  },

  testCWD: function() {
    vassert.assertEquals(java.lang.System.getProperty('user.dir'), process.cwd());
    vassert.testComplete();
  },

  testPID: function() {
    vassert.assertEquals(java.lang.management.ManagementFactory.getRuntimeMXBean().getName(), process.pid);
    vassert.testComplete();
  },

  testTitle: function() {
    vassert.assertEquals('Nodyn', process.title);
    vassert.testComplete();
  },

  testGlobalness: function() {
    vassert.assertEquals(process, function() { return process; }());
    vassert.testComplete();
  },

  testProcessConfig: function() {
    // somewhat pointless 
    // In node.js process.config returns the compile-time options of node.js
    vassert.assertNotNull(process.config);
    vassert.testComplete();
  },

  testProcessEventListeners: function() {
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
  },

  testNextTick: function() {
    var x = 0;
    var f = function(y) { x += y; }
    process.nextTick(f, 10);
    timer.setTimer(100, function() {
      vassert.assertEquals(10, x);
      vassert.testComplete();
    });
  },

  testMemoryUsage: function() {
    vassert.assertEquals('function', typeof process.memoryUsage);
    memory = process.memoryUsage();
    // TODO: Find Sigar replacement
  //  vassert.assertTrue(memory.heapTotal > memory.heapUsed);
    vassert.testComplete();
  },

  testUndocumentedProperties: function() {
    vassert.assertTrue(process.noDeprecation === false);
    vassert.assertTrue(process.traceDeprecation === false);
    vassert.testComplete();
  }
}

vertxTest.startTests(ProcessTests);
