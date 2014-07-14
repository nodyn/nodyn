
var streams      = require('nodyn/streams');
var util         = require('util');
var EventEmitter = require('events').EventEmitter;

function ChildProcess(child) {
  EventEmitter.call( this );
  this._process = new io.nodyn.child_process.ChildProcessWrap(process.EVENT_LOOP, child);

  this._process.on("exit", this._onExit.bind(this) );

  this._exitVal = 0;

  this._process.start();

  this._stdout = new streams.InputStream( this._process.stdout );
  this._stderr = new streams.InputStream( this._process.stderr );

  this._stdout.on('close', this._onCloseStdout.bind(this) );
  this._stderr.on('close', this._onCloseStderr.bind(this) );

  this._stdout._start();
  this._stderr._start();
};

util.inherits(ChildProcess, EventEmitter);

ChildProcess.prototype._onExit = function(result) {
  this.exitVal = result.result;
}

ChildProcess.prototype._onCloseStdout = function() {
  this._stdoutClosed = true;
  this._checkClosed();
}

ChildProcess.prototype._onCloseStderr = function() {
  this._stderrClosed = true;
  this._checkClosed();
}

ChildProcess.prototype._checkClosed = function() {
  if ( this._stdoutClosed && this._stderrClosed ) {
    this.emit( "close", this.exitVal );
  }
}

Object.defineProperty( ChildProcess.prototype, "stdin", {
  get: function() {
  },
  enumerable: true,
});

Object.defineProperty( ChildProcess.prototype, "stdout", {
  get: function() {
    return this._stdout;
  },
  enumerable: true,
});

Object.defineProperty( ChildProcess.prototype, "stderr", {
  get: function() {
    return this._stderr;
  },
  enumerable: true,
});

Object.defineProperty( ChildProcess.prototype, "pid", {
  get: function() {
  },
  enumerable: true,
});

Object.defineProperty( ChildProcess.prototype, "connected", {
  get: function() {
  },
  enumerable: true,
});

ChildProcess.prototype.kill = function(signal) {
};

ChildProcess.prototype.send = function(message,handler) {
};

ChildProcess.prototype.disconnect = function() {
}

var DEFAULT_OPTIONS = {
  cwd: undefined,
  env: process.env,
};

function spawn() {
  var command = arguments[0];
  var args    = [];
  var options = DEFAULT_OPTIONS;

  if ( arguments.length == 2 ) {
    if ( arguments[1] instanceof Array ) {
      args = arguments[1];
    }
  } else if ( arguments.length == 3 ) {
    if ( arguments[1] instanceof Array) {
      args = arguments[1];
      options = arguments[2];
    } else {
      options = arguments[1];
    }
  }

  var commandAndArgs = java.util.Arrays.asList( [ command ].concat( args ) );

  var pb = new java.lang.ProcessBuilder( commandAndArgs );
  if ( options.cwd ) {
    pb.directory( new java.io.File( options.cwd ) );
  }

  for ( e in options.env ) {
    pb.environment()[e] = options.env[e];
  }

  return new ChildProcess( pb );
};

function exec(command,options,callback) {
};

function execFile(file,args,options,callback) {
};

function fork(modulePath,args,options) {
};


module.exports.ChildProcess = ChildProcess;

module.exports.spawn     = spawn;
module.exports.exec      = exec;
module.exports.execFile  = execFile;
module.exports.fork      = fork;

