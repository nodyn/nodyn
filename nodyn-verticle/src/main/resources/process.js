var System = java.lang.System;
var vertx  = NativeRequire.require('vertx');

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
  var Mode         = java.nio.file.AccessMode;
  var Open         = java.nio.file.StandardOpenOption;
  var Node         = org.projectodd.nodyn.Node;
  var javaProcess  = new org.projectodd.nodyn.process.Process();
  var EventEmitter = NativeRequire.require('events').EventEmitter;

  this.context = new org.projectodd.nodyn.Context();
  this.title = "Nodyn";
  this.version = Node.VERSION;
  this.versions = {
      node: Node.VERSION,
      java: System.getProperty("java.version")
  };

  this.binding = {
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
  
  this.EventEmitter       = EventEmitter;
  this.on                 = EventEmitter.prototype.on;
  this.addListener        = EventEmitter.prototype.addListener;
  this.once               = EventEmitter.prototype.once;
  this.removeListener     = EventEmitter.prototype.removeListener;
  this.removeAllListeners = EventEmitter.prototype.removeAllListeners;
  this.setMaxListeners    = EventEmitter.prototype.setMaxListeners;
  this.listeners          = EventEmitter.prototype.listeners;
  this.emit               = EventEmitter.prototype.emit;
  
  this.memoryUsage = function() {
    os = NativeRequire.require('os');
    var obj = {};
    obj.heapTotal = os.totalmem();
    obj.heapUsed  = os.totalmem() - os.freemem();
    return obj;
  };
  
  this.nextTick = function(callback, args) {
    vertx.runOnContext(function() {
      callback(args);
    });
  };
  
  // TODO: this.config
  // Node.js puts the configure options that were used to compile the current
  // node executable in this.config
  this.config = {};
  this.env = getEnv();
  this.pid = java.lang.management.ManagementFactory.getRuntimeMXBean().getName();
  this.execPath = System.getProperty("user.dir"); // TODO: This doesn't make much sense
  this.moduleLoadList = [];
  this.argv = null;
  this.execArgv = null;
  this.features = null;
  this._eval = null;
  this._print_eval = null;
  this._forceRepl = null;
  this.debugPort = null;
  this._needTickCallback = null;
  this.reallyExit = null;
  this.abort = null;
  this.chdir = null;
  this.umask = null;
  this.getuid = null;
  this.setuid = null;
  this.getgid = null;
  this.setgid = null;
  this._kill = null;
  this._debugProcess = null;
  this._debugPause = null;
  this._debugEnd = null;
  this.hrtime = null;
  this.dlopen = null;
  this.uptime = null;

  this.cwd = function() {
    return System.getProperty("user.dir");
  };
};

module.exports = new Process();
