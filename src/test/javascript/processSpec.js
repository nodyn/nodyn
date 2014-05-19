var helper = require('specHelper');
var timer = require('vertx/timer');
var javaProcess = new org.projectodd.nodyn.process.Process();

describe('process', function() {

  it('should pass testProcessObject', function() {
    expect(process).not.toBe(null);
    expect(typeof process).toBe('object');
  });

  it('should pass testStdOut', function() {
    expect(process.stdout).not.toBe(null);
    expect(typeof process.stdout.write).toBe('function');
    process.stdout.write("A message to stdout");
  });

  it('should pass testStdErr', function() {
    expect(typeof process.stderr).toBe('object');
    expect(typeof process.stderr.write).toBe('function');
    process.stderr.write("A message to stderr");
  });

  it('should pass testStdIn', function() {
    expect(typeof process.stdin).toBe('object');
  });

  it('should pass testVersion', function() {
    expect(process.version).toBe(org.projectodd.nodyn.Node.VERSION);
    expect(process.versions).not.toBeNull();
    expect(process.versions.node).toBe(org.projectodd.nodyn.Node.VERSION);
    expect(process.versions.java).toBe(java.lang.System.getProperty("java.version"));
    // TODO: FIX THIS
    // expected:<[0.1.0]> but was:<[v0.1.1-8-g42b66a6-dirty]>
    // expect(process.versions.dynjs).toMatch(/0.2.2-*/);
  });

  it('should pass testExecPath', function() {
    expect(process.execPath).toBe(java.lang.System.getProperty('user.dir'));
  });

  it('should pass testArch', function() {
    expect(process.arch).toBe(javaProcess.arch());
  });

  it('should pass testPlatform', function() {
    expect(process.platform).toBe(javaProcess.platform());
  });

  it('should pass testProcessEvents', function() {
    expect(typeof process.addListener).toBe('function');
  });

  it('should pass testProcessEnv', function() {
    expect(typeof process.env).toBe('object');
    // Make sure we have a tmp dir property
    tmpDir = java.lang.System.getProperty("java.io.tmpdir");
    expect(process.env.TMPDIR).toBe(tmpDir);
    expect(process.env.TEMP).toBe(tmpDir);
    expect(process.env.TMP).toBe(tmpDir);
  });

  it('should pass testCWD', function() {
    expect(process.cwd()).toBe(java.lang.System.getProperty('user.dir'));
  });

  it('should pass testPID', function() {
    expect(process.pid).toBe(java.lang.management.ManagementFactory.getRuntimeMXBean().getName());
  });

  it('should pass testTitle', function() {
    expect(process.title).toBe('Nodyn');
  });

  it('should pass testGlobalness', function() {
    expect(function() { return process; }()).toBe(process);
  });

  it('should pass testProcessConfig', function() {
    // somewhat pointless
    // In node.js process.config returns the compile-time options of node.js
    expect(process.config).not.toBeNull();
  });

  it('should pass testProcessEventListeners', function() {
    // make sure process.on and process.addListener are aliased
    expect(process.on).toBe(process.addListener);
    var functionCalled = false;

    // set an event listener on 'foo'
    process.on('foo', function() { functionCalled = true; });
    expect(process.listeners('foo').length).toBe(1);
    process.emit('foo');
    expect(functionCalled).toBe(true);

    // reset our listeners
    process.removeAllListeners('foo');
    expect(process.listeners('foo').length).toBe(0);

    process.once('foo', function(str) { functionCalled = str; });
    process.emit('foo', 'bar');
    expect(functionCalled).toBe('bar');

    // This event should not be fired
    process.emit('foo', 'foobar');
    expect(functionCalled).toBe('bar');
  });

  it('should pass testNextTick', function() {
    var x = 0;
    var f = function(y) { x += y; };
    process.nextTick(f, 10);
    timer.setTimer(100, function() {
      expect(x).toBe(10);
    });
  });

  it('should pass testMemoryUsage', function() {
    expect(typeof process.memoryUsage).toBe('function');
    memory = process.memoryUsage();
    // TODO: Find Sigar replacement
    expect(memory.heapTotal > memory.heapUsed).toBe(true);
  });

  it('should pass testUndocumentedProperties', function() {
    expect(process.noDeprecation).toBe(false);
    expect(process.traceDeprecation).toBe(false);
  });
});
