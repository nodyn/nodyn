var fs     = NativeRequire.require('vertx/file_system');
var util   = require('util');
var Stream = require('stream');

var delegate = function(delegateFunc) {
  return function() {
    var last = Array.prototype.pop.call(arguments);
    var args = Array.prototype.slice.call(arguments);
    if (typeof last === 'function') {
      args.push(wrapHandler(last));
    } else if (last !== undefined) {
      args.push(last);
    }
    delegateFunc.apply(delegateFunc, args);
  };
};

var notImplemented = function(name, throws) {
  return function() {
    var msg = ["Error:", name, "not implemented"].join(' ');
    if (throws) {
      throw new Error(msg);
    }
    print(msg);
  };
};

var FS = {};
FS.readdir       = fs.readDir;
FS.readdirSync   = fs.readDirSync;
FS.rename        = fs.move;
FS.renameSync    = fs.moveSync;
FS.truncate      = fs.truncate;
FS.truncateSync  = fs.truncateSync;
FS.ftruncate     = fs.truncate;
FS.ftruncateSync = fs.truncateSync;
FS.exists        = delegate(fs.exists);
FS.existsSync    = fs.existsSync;
FS.chown         = fs.chown;
FS.fchown        = fs.chown;
FS.lchown        = fs.chown;
FS.chownSync     = fs.chownSync;
FS.fchownSync    = fs.chownSync;
FS.lchownSync    = fs.chownSync;
FS.readlink      = fs.readSymlink;
FS.readlinkSync  = fs.readSymlinkSync;
FS.unlink        = fs.unlink;
FS.unlinkSync    = fs.unlinkSync;
FS.rmdir         = fs.delete;
FS.rmdirSync     = fs.deleteSync;

// TODO: implement these functions
FS.realpath      = notImplemented("realpath", true);
FS.realpathSync  = notImplemented("realpathSync", true);
FS.utimes        = notImplemented("utimes");
FS.utimesSync    = notImplemented("utimesSync");
FS.futimes       = notImplemented("futimes");
FS.futimesSync   = notImplemented("futimesSync");
FS.write         = notImplemented("write");
FS.writeSync     = notImplemented("writeSync");
FS.read          = notImplemented("read");
FS.readSync      = notImplemented("readSync");
FS.appendFile    = notImplemented("appendFile");
FS.appendFileSync= notImplemented("appendFileSync");
FS.watchFile     = notImplemented("watchFile");
FS.unwatchFile   = notImplemented("unwatchFile");
FS.watch         = notImplemented("watch");

FS.readFile = function(path) { // [options], callback
  var args = Array.prototype.slice.call(arguments, 1);
  var func = args.pop();
  var opts = args.pop();
  if ((typeof opts) === 'string') {
    opts = { encoding: opts };
  }
  fs.readFile(path, function(err, buff) {
    if (opts && opts.encoding) {
      func(err, buff.toString(opts.encoding)); 
    } else {
      func(err, new Buffer(buff.toString())); 
    }
  });
};

FS.readFileSync = function(path, options) {
  var jBuffer = fs.readFileSync(path);
  if ((typeof options) === 'string') {
    options = { encoding: options };
  }
  if (options && options.encoding) {
    return jBuffer.toString(options.encoding); 
  }
  return new Buffer(jBuffer.toString());
};

FS.fsync = function(fd, callback) {
  fd.flush(callback);
};

FS.fsyncSync = function(fd) {
  fd.flush();
};

FS.close = function(fd, callback) {
  if (!(fd instanceof fs.AsyncFile)) {
    callback(Error("Don't know how to close " + fd));
  } else {
    fd.close(callback);
  }
};

FS.closeSync = function(fd) {
  if ((fd instanceof fs.AsyncFile)) {
    fd.close();
  }
};

FS.open = function(path, flags) {
  var args = Array.prototype.slice.call(arguments, 2);
  var func = args.pop();
  var mode = args.pop();
  var modeString = convertModeToString(mode);
  var flag = mapOpenFlags(flags);

  fs.open(path, flag, false, modeString, function(e, f) {
    if (e) {
      e = new Error(e.toString());
    }
    func.apply(func, [e, f]);
  });
};

FS.openSync = function(path, flags, mode) {
  var modeString = convertModeToString(mode);
  var flag = mapOpenFlags(flags);
  try {
    return fs.openSync(path, flag, true, modeString);
  } catch(e) {
    throw new Error(e.toString());
  }
};

FS.writeFile = function() {
  var filename = arguments[0];
  var data     = arguments[1];
  var callback = arguments[2];

  options  = {
    // default values
    'encoding': 'utf8',
    'mode': 0666,
    'flag': 'w'
  };

  if (typeof arguments[2] == 'object') {
    options  = arguments[2];
    callback = arguments[3];
  }

  fs.writeFile(filename, data, callback);
};

FS.chmod = function(path, mode, callback) {
  fs.chmod(path, convertModeToString(mode), callback);
};
FS.fchmod = FS.chmod;
FS.lchmod = FS.chmod;

FS.chmodSync = function(path, mode) {
  fs.chmodSync(path, convertModeToString(mode));
};
FS.fchmodSync = FS.chmodSync;
FS.lchmodSync = FS.chmodSync;


FS.mkdir = function(path, mode, callback) {
  // CreateParent boolean will always be false as NodeJS 
  // do not support this option
  fs.mkDir(path, false, convertModeToString(mode), callback);
};

FS.mkdirSync = function(path, mode) {
  fs.mkDirSync(path, false, convertModeToString(mode));
};

FS.stat = function(path, callback) {
  fs.props(path, function(err, result){
    callback(err, new Stat(result));
  });
};

FS.statSync = function(path) {
  return new Stat(fs.propsSync(path));
};

FS.lstat = function(path, callback) {
  fs.lprops(path, function(err, result){
    callback(err, new Stat(result));
  });
};

FS.lstatSync = function(path) {
  return new Stat(fs.lpropsSync(path));
};

FS.link = function(src, dest, callback) {
  fs.symlink(dest, src, callback);
};

FS.linkSync = function(src, dest) {
  fs.symlinkSync(dest, src);
};

FS.symlink = FS.link;
FS.symlinkSync = FS.linkSync;

FS.createReadStream = function(path, opts) {
  return new FS.ReadStream(path, opts);
};

FS.ReadStream = function(path, options) {
  Stream.Readable.call(this);
  options = util._extend({
    highWaterMark: 64 * 1024
  }, options || {});

  this.path = path;
  this.fd = options.hasOwnProperty('fd') ? options.fd : null;
  this.flags = options.hasOwnProperty('flags') ? options.flags : 'r';
  this.mode = options.hasOwnProperty('mode') ? options.mode : 438; /*=0666*/

  this.start = options.hasOwnProperty('start') ? options.start : undefined;
  this.end = options.hasOwnProperty('end') ? options.end : undefined;
  this.autoClose = options.hasOwnProperty('autoClose') ?
      options.autoClose : true;
  this.pos = undefined;

  if (!util.isUndefined(this.start)) {
    if (!util.isNumber(this.start)) {
      throw TypeError('start must be a Number');
    }
    if (util.isUndefined(this.end)) {
      this.end = Infinity;
    } else if (!util.isNumber(this.end)) {
      throw TypeError('end must be a Number');
    }

    if (this.start > this.end) {
      throw new Error('start must be <= end');
    }

    this.pos = this.start;
  }

  if (!util.isNumber(this.fd))
    this.open();

  this.on('end', function() {
    if (this.autoClose) {
      this.destroy();
    }
  });
};

util.inherits(FS.ReadStream, Stream.Readable);

FS.ReadStream.prototype.open = function() {
  fs.open(this.path, fs.OPEN_READ, openReadable(this));
};

FS.ReadStream.prototype._read = function(size) {
  this.resume();
};

FS.ReadStream.prototype.destroy = function() {
  if (this.destroyed)
    return;
  this.destroyed = true;

  if (this.fd instanceof fs.AsyncFile) {
    this.close();
  }
};

FS.ReadStream.prototype.close = function(cb) {
  var self = this;
  if (cb) this.once('close', cb);

  if (this.closed || !(this.fd instanceof fs.AsyncFile)) {
    if (!(this.fd instanceof fs.AsyncFile)) {
      this.once('open', close);
      return;
    }
    return process.nextTick(this.emit.bind(this.fd, 'close'));
  }
  this.closed = true;
  close();

  function close(fd) {
    FS.close(fd || self.fd, function(er) {
      if (er) self.emit('error', er);
      else self.emit('close');
    });
    self.fd = null;
  }
};

function openReadable(readable) {
  return function(err, asyncFile) {
    if (err) {
      if (readable.autoClose) {
        readable.destroy();
      }
      readable.emit('error', err);
      return;
    }
    asyncFile.endHandler(function(buffer) {
      // end of file signified in node.js as null
      readable.push(null);
    });

    asyncFile.dataHandler(function(buffer) {
      var str = buffer.toString(); // hmm
      if (!readable.push(str)) {
        readable.pause();
      }
    });
    readable.fd = asyncFile;
    readable.pause();
    readable.emit('open', asyncFile);
  };
}

var Stat = function(delegate) {
  this.size  = delegate.size;
  this.atime = new Date(delegate.lastAccessTime);
  this.mtime = new Date(delegate.lastModifiedTime);
  this.ctime = new Date(delegate.creationTime);

  this.isFile  = function() {
    return delegate.isRegularFile;
  };

  this.isDirectory  = function() {
    return delegate.isDirectory;
  };

  this.isSymbolicLink  = function() {
    return delegate.isSymbolicLink;
  };

  // Bunch of stuff not yet implemented
  this.dev   = undefined;
  this.ino   = undefined;
  this.mode  = undefined;
  this.nlink = undefined;
  this.uid   = undefined;
  this.gid   = undefined;
  this.rdev  = undefined;
  this.blksize = undefined;
  this.blocks  = undefined;
};

var invertAndConvert = function(x) {
  var e = parseInt(x).toString(2);
  var bitArray = e.split("");
  var convertedString = "";
  if(bitArray[0]=="0") {
    convertedString = convertedString.concat("-");
  }
  else {
    convertedString = convertedString.concat("r");
  }

  if(bitArray[1]=="0") {
    convertedString =  convertedString.concat("-");
  }
  else {
    convertedString = convertedString.concat("w");
  }

  if(bitArray[2]=="0") {
    convertedString =  convertedString.concat("-");
  }
  else {
    convertedString = convertedString.concat("x");
  }
  return convertedString;
};
 
var modeCache = {};
var convertModeToString = function(mode) {
  if (!mode) { 
    mode = 0666; 
  }
  if (modeCache[mode]) {
    return modeCache[mode];
  }
  var octalString = mode.toString(8);
  var intArray = octalString.split("");
  var result = "";
  for (var i=0;i<intArray.length;i++) {
    result = result.concat(invertAndConvert(intArray[i]));
  }
  modeCache[mode] = result;
  return result;
};

var mapOpenFlags = function(flags) {
  var flag = 0;
  
  switch(flags) {
    case 'r': 
    case 'rs':
      flag = fs.OPEN_READ;
      break;
    case 'r+': 
    case 'rs+':
      flag = fs.OPEN_READ | fs.OPEN_WRITE;
      break;
    case 'w':
      flag = fs.OPEN_WRITE;
      break;
    case 'wx':
      flag = fs.OPEN_WRITE | fs.CREATE_NEW;
      break;
    case 'w+':
      flag = fs.OPEN_READ | fs.OPEN_WRITE;
      break;
    case 'wx+':
      flag = fs.OPEN_READ | fs.OPEN_WRITE | fs.CREATE_NEW;
      break;
    // todo: deal with append modes
  }
  return flag;
};

var wrapHandler = function(func) {
  return function(err, result) {
    if (err) {
      return func(err);
    }
    return func(result);
  };
};

module.exports = FS;
