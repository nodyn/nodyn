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
      Node         = io.nodyn.Nodyn,
      javaProcess  = new io.nodyn.process.Process();

  if (typeof __vertx === 'undefined') {
    print("CREATING NEW __VERTX");
    java.lang.System.setProperty("vertx.pool.eventloop.size", "1");
    this.context = org.vertx.java.core.VertxFactory.newVertx();
    var elg = null;
    this.context.runOnContext(function() {
      var elg = this.context.getEventLoopGroup();
      print("SETTING ELG "+elg);
      this.EVENT_LOOP = new io.nodyn.netty.ManagedEventLoopGroup(elg);
      }.bind(this));
  } else {
    print("USING MAIN __VERTX");
    this.context = __vertx;
    this.EVENT_LOOP  = new io.nodyn.netty.ManagedEventLoopGroup(this.context.getEventLoopGroup());
  }
  this.title       = "Nodyn";
  this.version     = Node.VERSION;

  this.versions    = {
      node: Node.VERSION,
      dynjs: org.dynjs.runtime.DynJS.VERSION,
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
  this.EVENT_LOOP.incrCount();
  this.context.runOnContext(function() {
    callback(args);
    this.EVENT_LOOP.decrCount();
  }.bind(this));
};

Process.prototype.cwd = function() {
  return System.getProperty("user.dir");
};

Process.prototype.exit = function() {
  print("EXITING PROCESS");
  this.context.stop();
  this.emit('exit');
};

// for now
Process.prototype.abort = Process.prototype.exit;

module.exports = Process;
