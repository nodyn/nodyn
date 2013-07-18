var System = java.lang.System;
var Node   = org.projectodd.nodyn.Node;
var Java   = System.getProperty("java.version");

var Mode   = java.nio.file.AccessMode;
var Open   = java.nio.file.StandardOpenOption;

var getEnv = function() {
  env = {}
  tmpDir = System.getProperty("java.io.tmpdir");
  if (tmpDir == null || tmpDir == undefined) {
    tmpDir = "/tmp";
  }
  env['TMPDIR'] = tmpDir;
  env['TMP']    = tmpDir;
  env['TEMP']   = tmpDir;

  sysenv = System.getenv();
  for (key in sysenv) {
    env[key] = sysenv.get(key).replace('.', '_');
  }
  return env;
}

var Process = function() {
  var that = this;

  this.version = Node.VERSION;
  this.versions = {
      node: Node.VERSION,
      java: Java
      // dynjs: 
  };

  this.binding = {};
  this.binding.constants = {
    O_RDONLY: Mode.READ,
    O_WRONLY: Mode.WRITE,
    O_RDWR: Mode.WRITE,
    O_APPEND: Open.APPEND,
    S_IMFT: 0
  };

  // QueryString initialized in NodeJSVerticleFactory
  this.binding.QueryString = nodyn.QueryString;

  this.noDeprecation = true;
  this.traceDeprecation = false;

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
  }
}

var process = new Process();
module.exports = process;
