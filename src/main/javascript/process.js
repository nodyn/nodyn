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
  var Mode         = java.nio.file.AccessMode,
      Open         = java.nio.file.StandardOpenOption,
      Node         = org.projectodd.nodyn.Node,
      javaProcess  = new org.projectodd.nodyn.process.Process();

  this.context     = org.vertx.java.core.VertxFactory.newVertx();
  this.title       = "Nodyn";
  this.version     = Node.VERSION;

  this.versions    = {
      node: Node.VERSION,
      java: System.getProperty("java.version")
  };

  this.binding     = {
    constants: {
      O_RDONLY: Mode.READ.toString(),
      O_WRONLY: Mode.WRITE.toString(),
      O_RDWR: Mode.WRITE.toString(),
      O_APPEND: Open.APPEND.toString(),
      S_IMFT: 0
    }
  };

  this.stdout = {
    write: function(message) {
      java.lang.System.out.print(message);
    }
  };

  this.stderr = {
    write: function(message) {
      java.lang.System.err.print(message);
    }
  };

  // TODO: Fix this
  this.stdin = {
    read: function() {
    }
  };

  // QueryString initialized in NodeJSVerticleFactory
  this.binding.QueryString = nodyn.QueryString;

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
  this.argv = null;
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
  os = NativeRequire.require('os');
  var obj = {};
  obj.heapTotal = os.totalmem();
  obj.heapUsed  = os.totalmem() - os.freemem();
  return obj;
};

Process.prototype.nextTick = function(callback, args) {
  this.context.runOnContext(function() {
    callback(args);
  });
};

Process.prototype.cwd = function() {
  return System.getProperty("user.dir");
};

Process.prototype.exit = function() {
  this.context.stop();
  this.emit('exit');
};

// for now
Process.prototype.abort = Process.prototype.exit;

module.exports = Process;
