
var getEnv = function() {
  env = {};
  tmpDir = System.getProperty("java.io.tmpdir");
  if (tmpDir === null || tmpDir === undefined) {
    tmpDir = "/tmp";
  }
  env.TMPDIR = tmpDir;
  env.TMP    = tmpDir;
  env.TEMP   = tmpDir;

  sysenv = System.getenv();
  for (var key in sysenv) {
    env[key] = sysenv.get(key).replace('.', '_');
  }
  return env;
};

var Process = function() {
  var Node         = io.nodyn.Nodyn,
      javaProcess  = new io.nodyn.process.Process();

  this.context     = __vertx;
  this.EVENT_LOOP  = __nodyn.managedLoop;
  this.title       = "Nodyn";
  this.version     = Node.VERSION;

  this.versions    = {
      node: Node.VERSION,
      dynjs: org.dynjs.runtime.DynJS.VERSION,
      java: System.getProperty("java.version")
  };

  this.stderr = {
    write: function(message) {
      java.lang.System.err.print(message);
    }
  };

  this.arch = javaProcess.arch();
  this.platform = javaProcess.platform();
  this.noDeprecation = false;
  this.traceDeprecation = false;

  // TODO: this.config
  // Node.js puts the configure options that were used to compile the current
  // node executable in this.config
  this.config = {};
  this.env = getEnv();
  this.pid = java.lang.management.ManagementFactory.getRuntimeMXBean().getName();
  this.execPath = System.getProperty("user.dir"); // TODO: This doesn't make much sense
  this.argv = [ System.getProperty('nodyn.binary') || 'nodyn' ];
  System.err.println( "dynjs.argv: " + dynjs.argv );
  if ( dynjs.argv ) {
    for ( i = 0 ; i < dynjs.argv.length ; ++i ) {
      this.argv.push( dynjs.argv[i] );
    }
  }
  this.execArgv = null;
  this.features = null;
  this.debugPort = null;
  this.chdir = null;
  this.umask = null;
  this.getuid = null;
  this.setuid = null;
  this.getgid = null;
  this.setgid = null;
  this.hrtime = null;
  this.dlopen = null;
  this.uptime = null;
};

var util = require('util');
var EE   = require('events').EventEmitter;
util.inherits(Process, EE);

Process.prototype.memoryUsage = function() {
  os = require('os');
  var obj = {};
  obj.heapTotal = os.totalmem();
  obj.heapUsed  = os.totalmem() - os.freemem();
  return obj;
};

Process.prototype.nextTick = function(callback, args) {
  var handle = process.EVENT_LOOP.newHandle();
  process.context.runOnContext(function() {
    callback(args);
    handle.unref();
  });
};

Process.prototype.cwd = function() {
  return System.getProperty("user.dir");
};

Process.prototype.exit = function() {
  //print("EXITING PROCESS");
  //this.context.stop();
  process.EVENT_LOOP.shutdown();
  this.emit('exit');
};

Process.prototype._setupDomainUse = function(domain,flags) {
  //print( "_setupDomainUse, whatever that means" );
};


// for now
Process.prototype.abort = Process.prototype.exit;

// Mimic node.js process.binding()
Process.prototype.binding = function(name) {
  // Lazily require bindings to prevent
  // race conditions during bootstrap
  var fs        = require('nodyn/bindings/fs');
  var constants = require('nodyn/bindings/constants');
  var smalloc   = require('nodyn/bindings/smalloc');
  var zlib      = require('nodyn/bindings/zlib');

  switch(name) {
    case 'zlib':
      return zlib;
    case 'fs':
      return fs;
    case 'constants':
      return constants;
    case 'smalloc':
      return smalloc;
    default:
      return {};
  }
};

module.exports = Process;
