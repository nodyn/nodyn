var nodyn      = require('nodyn'),
    util       = require('util'),
    blocking   = require('nodyn/blocking'),
    posix      = Packages.jnr.posix.POSIXFactory.getPOSIX(new io.nodyn.posix.NodePosixHandler(), true),
    Errno      = Packages.jnr.constants.platform.Errno,
    File       = Packages.java.io.File,
    Fs         = Packages.io.nodyn.fs.Fs,
    binding    = module.exports,
    statsCtor  = null;


// Executes work asynchronously if async is provided and is a function -
// otherwise, just executes the work and returns the result. If executing
// async and successful, the callback function is executed on the next tick.
// If there is an error and the throws param is falsy just returns the
// result.err property, otherwise throw it.
function executeWork(work, async, throws) {
  if (typeof async === 'function') { // Async
    blocking.submit(function() {
      var result = work();
      process.nextTick(function() {
        async(result.err, result.result);
      });
    });
  } else { // Sync
    var result = work();
    if (result.err) {
      if (throws) throw result.err;
      else return result.err;
    }
    return result.result;
  }
}

binding.FSInitialize = function(stats) {
  // fs.js uses this in "native" node.js to inform the C++ in
  // node_file.cc what JS function is used to construct an fs.Stat
  // object. For now, we'll just construct ours in JS and see how it goes.
  statsCtor = stats;
};

function buildStat(path, statf) {
  var err, stats,
      delegate = posix.allocateStat(),
      result = statf(delegate);

  if (result !== -1) {
    stats = new statsCtor(
      delegate.dev(),
      delegate.mode(),
      delegate.nlink(),
      delegate.uid(),
      delegate.gid(),
      delegate.rdev(),
      delegate.blockSize(),
      delegate.ino(),
      delegate.st_size(),
      delegate.blocks(),
      delegate.atime(),
      delegate.mtime(),
      delegate.ctime(),
      delegate.ctime() // TODO: I don't know what birthtim_msec should be
    );
  } else err = posixError(path, 'stat');
  return {err:err, result:stats};
}

binding.stat = function(path, callback) {
  function work() {
    return buildStat(path, function(stat) { return posix.stat(path, stat); });
  }
  return executeWork(work.bind(this), callback, true);
};

binding.lstat = function(path, callback) {
  function work() {
    return buildStat(path, function(stat) { return posix.lstat(path, stat); });
  }
  return executeWork(work.bind(this), callback, true);
};

binding.fstat = function(fd, callback) {
  function work() {
    return buildStat(fd, function(stat) { return posix.fstat(fd, stat); });
  }
  return executeWork(work.bind(this), callback, true);
};

binding.open = function(path, flags, mode, callback) {
  function work() {
    var fd = posix.open(path, flags, mode), err;
    if (fd === -1) err = posixError(path, 'open');
    return {err:err, result:fd};
  }
  return executeWork(work.bind(this), callback, true);
};

binding.close = function(fd, callback) {
  function work() {
    if (fd === null || fd === undefined) {
      return {err: new Error("Don't know how to close null")};
    }
    var success = posix.close(fd), err;
    if (success === -1) err = posixError(null, 'close');
    return {err:err, result:undefined};
  }
  return executeWork(work.bind(this), callback);
};

binding.writeBuffer = function(fd, buffer, offset, length, position, callback) {
  function work() {
    // TODO: Error checking
    // e.g. https://github.com/joyent/node/blob/master/src/node_file.cc#L788-L795
    var toWrite = buffer.slice(offset, offset+length);
        var bytes   = toWrite._buffer.byteArray();
        var written = posix.write(fd, bytes, length), err;

    if (written === -1) err = posixError(path, 'write');
    return {err: err, result: written};
  }
  return executeWork(work.bind(this), callback);
};

binding.mkdir = function(path, mode, callback) {
  function work() {
    var success = posix.mkdir(path, mode), err;
    if (success === -1) err = posixError(path, 'mkdir');
    return {err: err, result: success};
  }
  return executeWork(work.bind(this), callback);
};

binding.rmdir = function(path, callback) {
  function work() {
    var success = posix.rmdir(path), err;
    if (success === -1) err = posixError(path, 'rmdir');
    return {err: err, result: success};
  }
  return executeWork(work.bind(this), callback);
};

binding.rename = function(from, to, callback) {
  function work() {
    var fromFile = new File(from),
        toFile = new File(to), err;
    if (!fromFile.exists() || !fromFile.renameTo(toFile)) err = posixError(from, 'rename');
    return {err:err};
  }
  return executeWork(work.bind(this), callback);
};

binding.ftruncate = function(fd, len, callback) {
  function work() {
    var result = posix.ftruncate(fd, len), err;
    if (result === -1) err = posixError(null, 'ftruncate');
    return {err:err, result:result};
  }
  return executeWork(work.bind(this), callback);
};

binding.readdir = function(path, callback) {
  function work() {
    var dir = new File( path ), err, files;
    if (!dir.isDirectory()) err = posixError(path, 'readdir');
    else files = dir.list();
    return {err:err, result:nodyn.arrayConverter(files)};
  }
  return executeWork(work.bind(this), callback);
};

binding.read = function(fd, buffer, offset, length, position, callback) {
  position = position || 0;
  offset = offset || 0;
  // we can't use the executeWork function here because the read() callback
  // takes 3 parameters, and executeWork only works with cb(err, result)
  print(new Error().stack);
  if (typeof callback === 'function') { // Async
    blocking.submit(function() {
      var bytes = Fs.read(fd, buffer._buffer, offset, length, position), err;
      if (bytes === -1) err = posixError(fd, 'read');
      process.nextTick(function() {
        callback(err, bytes, buffer);
      }.bind(this));
    }.bind(this));
  } else { // Sync
    var bytes = Fs.read(fd, buffer._buffer, offset, length, position);
    if (bytes === -1) throw posixError(fd, 'read');
    return bytes;
  }
};

binding.unlink = function(path, callback) {
  executeWork(function() {
    if (posix.unlink(path) === -1) {
      return {err:posixError(path, 'unlink')};
    }
  }.bind(this), callback);
};

function posixError(path, syscall) {
  var errno = posix.errno(),
      errEnum = Errno.values()[errno];
      e = new Error(errEnum.description());

  e.errno   = errno;
  e.path    = path;
  e.syscall = syscall;
  e.code    = errEnum.name();
  return e;
}

/**
function throwENOENT(path, syscall) {
  throw posixError(Errno.valueOf('ENOENT').intValue(), path, syscall);
}

var system = process.context.fileSystem(),
    nodyn     = require('nodyn'),
    util      = require('util'),
    Path      = require('path'),
    Stream    = require('stream'),
    AsyncFile = org.vertx.java.core.file.AsyncFile,

var FS = {};

// TODO: implement these functions
FS.utimes        = nodyn.notImplemented("utimes");
FS.utimesSync    = nodyn.notImplemented("utimesSync");
FS.futimes       = nodyn.notImplemented("futimes");
FS.futimesSync   = nodyn.notImplemented("futimesSync");
FS.appendFile    = nodyn.notImplemented("appendFile");
FS.appendFileSync= nodyn.notImplemented("appendFileSync");
FS.watchFile     = nodyn.notImplemented("watchFile");
FS.unwatchFile   = nodyn.notImplemented("unwatchFile");
FS.watch         = nodyn.notImplemented("watch");

// When vertx file system functions mirror node file system
// functions, we can use this high-order function to
// delegate. It passes args unmolested into the vertx
// API, and provides a possibly converted return value
// (or callback arg). If the type/order of function
// arguments don't match up between vertx and node, then
// don't use this function.
function delegateFunction(f, converter) {
  return function() {
    if (!converter) { converter = function(result) { return result; }; }
    var args = Array.prototype.slice.call(arguments);
    var last = args[args.length - 1];
    if (typeof last === 'function') {
        args[args.length - 1] = nodyn.vertxHandler(last, converter);
    }
    return converter(f.apply(system, args));
  };
}

FS.truncate      = delegateFunction(system.truncate);
FS.truncateSync  = delegateFunction(system.truncateSync);
FS.ftruncate     = delegateFunction(system.truncate);
FS.ftruncateSync = delegateFunction(system.truncateSync);
FS.rename        = delegateFunction(system.move);
FS.renameSync    = delegateFunction(system.moveSync);
FS.readdirSync   = delegateFunction(system.readDirSync, nodyn.arrayConverter);
FS.chown         = delegateFunction(system.chown);
FS.fchown        = delegateFunction(system.chown);
FS.lchown        = delegateFunction(system.chown);
FS.chownSync     = delegateFunction(system.chownSync);
FS.fchownSync    = delegateFunction(system.chownSync);
FS.lchownSync    = delegateFunction(system.chownSync);
FS.readlink      = delegateFunction(system.readSymlink);
FS.readlinkSync  = delegateFunction(system.readSymlinkSync);
FS.unlink        = delegateFunction(system.unlink);
FS.unlinkSync    = delegateFunction(system.unlinkSync);
FS.rmdir         = delegateFunction(system.delete);
FS.rmdirSync     = delegateFunction(system.deleteSync);
FS.lstat         = delegateFunction(system.lprops,     function(result) { return new Stat(result); } );
FS.lstatSync     = delegateFunction(system.lpropsSync, function(result) { return new Stat(result); } );


function stat(path) {
  return new FS.Stat(path);
}

FS.stat = function(path, callback) {
  nodyn.asyncAction(function() {
    return stat(path);
  }, callback);
  return this;
};

FS.statSync = stat;

function realpath(path, cache) {
  cache = cache || {};
  path = Path.resolve(path);
  if (Object.prototype.hasOwnProperty.call(cache, path)) {
    return cache[path];
  }
  var file = new java.io.File(path);
  if (file.exists())
    return file.getCanonicalPath();

  throwENOENT(file.getCanonicalPath(), 'realpath');
}

FS.realpath = function(path) {
  var args     = Array.prototype.slice.call(arguments, 1),
      callback = args.pop(),
      cache    = args.pop() || {};

  nodyn.asyncAction(function() {
    return realpath(path, cache);
  }, callback);
};

FS.realpathSync = realpath;

FS.exists = function(path, callback) {
  system.exists(path, function(future) {
    callback(future.result());
  });
};

FS.existsSync = function(path) {
  return system.existsSync(path);
};

FS.read = function(fd, buffer, offset, length, position, callback) {
  // fd is a vertx AsyncFile
  fd.read(buffer._vertxBuffer(), offset, position, length, nodyn.vertxHandler(function(err, buf) {
    callback(err, length, buf);
  }));
};

FS.readSync = function(fd, buffer, offset, length, position) {
  fd.read(buffer._vertxBuffer(), offset, position, length);
};

FS.readFile = function(path) { // [options], callback
  var args = Array.prototype.slice.call(arguments, 1);
  var func = args.pop();
  var opts = args.pop();
  if ((typeof opts) === 'string') {
    opts = { encoding: opts };
  }
  system.readFile(path, nodyn.vertxHandler(function(err, buff) {
    if (opts && opts.encoding) {
      func(err, buff.toString(opts.encoding));
    } else {
      func(err, new Buffer(buff));
    }
  }));
};

FS.readFileSync = function(path, options) {
  var jBuffer = system.readFileSync(path);
  if ((typeof options) === 'string') {
    options = { encoding: options };
  }
  if (options && options.encoding) {
    return jBuffer.toString(options.encoding);
  }
  return new Buffer(jBuffer);
};

FS.fsync = function(fd, callback) {
  fd.flush(nodyn.vertxHandler(callback));
};

FS.fsyncSync = function(fd) {
  fd.flush();
};

FS.close = function(fd, callback) {
  if (!(fd instanceof AsyncFile)) return callback(new Error("Don't know how to close " + fd));
  fd.close(nodyn.vertxHandler(callback));
};

FS.closeSync = function(fd) {
  if (!(fd instanceof AsyncFile)) return new Error("Don't know how to close " + fd);
  fd.close();
};

FS.open = function(path, flags) {
  var args = Array.prototype.slice.call(arguments, 2);
  var func = args.pop();
  var mode = args.pop();
  var flag = mapOpenFlags(flags);
  system.open(path, convertModeToString(mode), flag.read, flag.write, flag.create, nodyn.vertxHandler(func));
};

FS.openSync = function(path, flags, mode) {
  var modeString = convertModeToString(mode);
  var flag = mapOpenFlags(flags);
  try {
    return system.openSync(path, modeString, flag.read, flag.write, flag.create);
  } catch(e) {
    throw new Error(e.toString());
  }
};

FS.writeFile = function(filename, data, options, callback) {
  var buffer;
  if (typeof options === 'function') {
    callback = options;
    options = {
      // default values
      'encoding': 'utf8',
      'mode': 0666,
      'flag': 'w'
    };
  }
  if (data instanceof Buffer) {
    buffer = data._vertxBuffer();
  } else {
    buffer = new org.vertx.java.core.buffer.Buffer( data.toString() );
  }
  system.writeFile(filename, buffer, nodyn.vertxHandler(callback));
};

FS.writeFileSync = function(filename, data, options) {
  var buffer;
  if (typeof options === 'function') {
    callback = options;
    options = {
      // default values
      'encoding': 'utf8',
      'mode': 0666,
      'flag': 'w'
    };
  }
  if (data instanceof Buffer) {
    buffer = data._vertxBuffer();
  } else {
    buffer = new org.vertx.java.core.buffer.Buffer( data.toString() );
  }
  system.writeFileSync(filename, buffer);
};

FS.chmod = function(path, mode, callback) {
  system.chmod(path, convertModeToString(mode), nodyn.vertxHandler(callback));
};
FS.fchmod = FS.chmod;
FS.lchmod = FS.chmod;

FS.chmodSync = function(path, mode) {
  system.chmodSync(path, convertModeToString(mode));
};
FS.fchmodSync = FS.chmodSync;
FS.lchmodSync = FS.chmodSync;


FS.mkdir = function(path, mode, callback) {
  // CreateParent boolean will always be false as NodeJS
  // does not support this option
  mode = mode || 0777;
  system.mkdir(path, convertModeToString(mode), false, nodyn.vertxHandler(callback));
};

FS.mkdirSync = function(path, mode) {
  system.mkdirSync(path, convertModeToString(mode), false);
  return this;
};

FS.link = function(src, dest, callback) {
  system.symlink(dest, src, nodyn.vertxHandler(callback));
};

FS.linkSync = function(src, dest) {
  system.symlinkSync(dest, src);
};

FS.symlink = FS.link;
FS.symlinkSync = FS.linkSync;

// From: http://nodejs.org/api/fs.html#fs_fs_write_fd_buffer_offset_length_position_callback
// Write buffer to the file specified by fd.
//
// offset and length determine the part of the buffer to be written.
//
// position refers to the offset from the beginning of the file where this
// data should be written. If position is null, the data will be written at
// the current position. See pwrite(2).
//
// The callback will be given three arguments (err, written, buffer) where
// written specifies how many bytes were written from buffer.
FS.write = function(fd, buffer, offset, length, position, callback) {
  fd.write(buffer.slice(offset, length), nodyn.vertxHandler(callback));
};

FS.writeSync = function(fd, buffer, offset, length, position) {
  fd.write(buffer.slice(offset, length), nodyn.vertxHandler(callback));
};

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
  this.mode = options.hasOwnProperty('mode') ? options.mode : 438; // =0666

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

  if (!this.fd) this.open();

  this.on('end', function() {
    if (this.autoClose) {
      this.destroy();
    }
  });
};

util.inherits(FS.ReadStream, Stream.Readable);

FS.ReadStream.prototype.open = function() {
  FS.open(this.path, 'r', openReadable(this));
};

FS.ReadStream.prototype._read = function(size) {
  this.resume();
};

FS.ReadStream.prototype.destroy = function() {
  if (this.destroyed)
    return;
  this.destroyed = true;
  if (this.fd instanceof AsyncFile) this.close();
};

FS.ReadStream.prototype.close = function(cb) {
  var self = this;
  if (cb) this.once('close', cb);

  if (this.closed || !(this.fd instanceof AsyncFile)) {
    if (!(this.fd instanceof AsyncFile)) {
      this.once('open', close);
      return;
    }
    return process.nextTick(this.emit.bind(this, 'close'));
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
      var buff = new Buffer(buffer);
      if (readable.pos) {
        buff = buff.slice(readable.start, readable.end);
      }
      if (!readable.push(buff)) {
        readable.pause();
      }
    });
    readable.fd = asyncFile;
    readable.pause();
    process.nextTick(readable.emit.bind(readable, 'open'));
  };
}

FS.createWriteStream = function(path, opts) {
  return new FS.WriteStream(path, opts);
};

FS.WriteStream = function(path, options) {
  if (!(this instanceof FS.WriteStream))
    return new FS.WriteStream(path, options);

  options = options || {};

  Stream.Writable.call(this, options);

  this.path = path;
  this.fd = null;

  this.fd = options.hasOwnProperty('fd') ? options.fd : null;
  this.flags = options.hasOwnProperty('flags') ? options.flags : 'w';
  this.mode = options.hasOwnProperty('mode') ? options.mode : 438; //=0666

  this.start = options.hasOwnProperty('start') ? options.start : undefined;
  this.pos = undefined;
  this.bytesWritten = 0;

  if (!util.isUndefined(this.start)) {
    if (!util.isNumber(this.start)) {
      throw TypeError('start must be a Number');
    }
    if (this.start < 0) {
      throw new Error('start must be >= zero');
    }

    this.pos = this.start;
  }
  if (!this.fd) this.open();

  // dispose on finish.
  this.once('finish', this.close);
};
util.inherits(FS.WriteStream, Stream.Writable);
FS.FileWriteStream = FS.WriteStream; // support the legacy name

FS.WriteStream.prototype.open = function() {
  FS.open(this.path, this.flags, this.mode, function(er, fd) {
    if (er) {
      this.destroy();
      this.emit('error', er);
      return;
    }

    this.fd = fd;
    this.emit('open', fd);
  }.bind(this));
};

FS.WriteStream.prototype._write = function(data, encoding, cb) {
  if (!util.isBuffer(data))
    return this.emit('error', new Error('Invalid data'));

  if (!this.fd)
    return this.once('open', function() {
      this._write(data, encoding, cb);
    });

  var self = this;
  FS.write(this.fd, data, 0, data.length, this.pos, function(er, bytes) {
    if (er) {
      self.destroy();
      return cb(er);
    }
    self.bytesWritten += bytes;
    cb();
  });

  if (!util.isUndefined(this.pos))
    this.pos += data.length;
};

FS.WriteStream.prototype.destroy = FS.ReadStream.prototype.destroy;
FS.WriteStream.prototype.close = FS.ReadStream.prototype.close;
FS.WriteStream.prototype.destroySoon = FS.WriteStream.prototype.end;




function invertAndConvert(x) {
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
}

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


module.exports = FS;
*/
