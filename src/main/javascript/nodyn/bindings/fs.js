/*
 * Copyright 2014 Red Hat, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

var nodyn       = require('nodyn'),
    util        = require('util'),
    path        = require('path'),
    blocking    = require('nodyn/blocking'),
    StatWatcher = process.binding('stat_watcher').StatWatcher,
    posix       = process._posix,
    Errno       = Packages.jnr.constants.platform.Errno,
    File        = Packages.java.io.File,
    Fs          = Packages.io.nodyn.fs.Fs,
    binding     = module.exports,
    statsCtor   = null;

// Executes work asynchronously if async is provided and is a function -
// otherwise, just executes the work and returns the result. If executing
// async and successful, the callback function is executed on the next tick.
// If there is an error and the throws param is falsy just returns the
// result.err property, otherwise throw it.
function executeWork(work, async, throws) {
  if (typeof async === 'function') { // Async
    blocking.submit(function() {
      var result = work();
      result = result || {};
      blocking.unblock(async)( result.err, result.result );
    });
  } else { // Sync
    var result = work();
    result = result || {};
    if (result.err) {
      if (throws) throw result.err;
      else return result.err;
    }
    return result.result;
  }
}

function possiblyRelative(p) {
  if (path.isAbsolute(p)) return p;
  return path.resolve(process.cwd(), p);
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
      // must convert Java Long to JS Number since JDK 1.8.0_101, see http://mail.openjdk.java.net/pipermail/nashorn-dev/2016-October/006552.html
      Number(delegate.dev()),
      delegate.mode(),
      delegate.nlink(),
      delegate.uid(),
      delegate.gid(),
      Number(delegate.rdev()),
      Number(delegate.blockSize()),
      Number(delegate.ino()),
      Number(delegate.st_size()),
      Number(delegate.blocks()),
      Number(delegate.atime()),
      Number(delegate.mtime()),
      Number(delegate.ctime()),
      Number(delegate.ctime()) // TODO: I don't know what birthtim_msec should be
    );
  } else err = posixError(possiblyRelative(path), 'stat');
  return {err:err, result:stats};
}

binding.StatWatcher = StatWatcher;

binding.stat = function(path, callback) {
  path = possiblyRelative(path);
  function work() {
    return buildStat(path, function(stat) { return posix.stat(path, stat); });
  }
  return executeWork(work.bind(this), callback, true);
};

binding.lstat = function(path, callback) {
  path = possiblyRelative(path);
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
  path = possiblyRelative(path);
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
    if (offset > buffer.length) throw new RangeError('offset out of bounds');
    if (length > buffer.length) throw new RangeError('length out of bounds');
    if (offset + length < offset) throw new RangeError('offset + length overflow');
    if (offset + length > buffer.length)
      throw new RangeError('offset + length > buffer.length');

    var toWrite = buffer.slice(offset, offset+length);
    var bytes   = toWrite._byteArray();
    var written = posix.write(fd, bytes, length), err;

    if (written === -1) err = posixError(fd, 'write');
    return {err: err, result: written};
  }
  return executeWork(work.bind(this), callback);
};

binding.writeString = function(fd, str, position, enc, callback) {
  // TODO: Is this kosher?
  var buf = new Buffer(str, enc);
  return binding.writeBuffer(fd, buf, 0, buf.length, position, callback);
};

binding.mkdir = function(path, mode, callback) {
  path = possiblyRelative(path);
  function work() {
    var success = posix.mkdir(path, mode), err;
    if (success === -1) err = posixError(path, 'mkdir');
    return {err: err, result: success};
  }
  return executeWork(work.bind(this), callback);
};

binding.rmdir = function(path, callback) {
  path = possiblyRelative(path);
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
    if (result === -1) {
      err = posixError(null, 'ftruncate');
    }
    return {err:err, result:result};
  }
  return executeWork(work.bind(this), callback);
};

binding.readdir = function(path, callback) {
  path = possiblyRelative(path);
  function work() {
    var dir = new File( path ), err, files;
    if (! dir.isDirectory()) {
      if ( dir.exists() ) {
        err = new Error("ENOTDIR");
        err.errno = 23;
        err.syscall = 'readdir';
        err.path = path;
        err.code = "ENOTDIR";
      } else {
        err = new Error("ENOENT");
        err.errno = 2;
        err.syscall = 'readdir';
        err.path = path;
        err.code = "ENOENT";
      }
    } else {
      files = dir.list();
    }
    return {err:err, result:nodyn.arrayConverter(files)};
  }
  return executeWork(work.bind(this), callback, true);
};

binding.read = function(fd, buffer, offset, length, position, callback) {
  var bytes;
  offset = offset || 0;
  // we can't use the executeWork function here because the read() callback
  // takes 3 parameters, and executeWork only works with cb(err, result)
  if (typeof callback === 'function') { // Async
    blocking.submit(function() {
      if ( position && position !== -1 ) {
        bytes = Fs.pread(posix, fd, buffer._rawBuffer(), offset, length, position);
      } else {
        bytes = Fs.read(posix, fd, buffer._rawBuffer(), offset, length);
      }
      blocking.unblock(function() {
        callback(undefined, bytes, buffer);
      })();
    }.bind(this));
  } else { // Sync
    if ( position && position !== -1 ) {
      bytes = Fs.pread(posix, fd, buffer._rawBuffer(), offset, length, position);
    } else {
      bytes = Fs.read(posix, fd, buffer._rawBuffer(), offset, length);
    }
    if (bytes === -1) throw posixError(fd, 'read');
    return bytes;
  }
};

binding.link = function(srcpath, dstpath, callback) {
  srcpath = possiblyRelative(srcpath);
  dstpath = possiblyRelative(dstpath);
  return executeWork(function() {
    if (posix.link(srcpath, dstpath) === -1) {
      return {err:posixError(srcpath, 'link')};
    }
  }.bind(this), callback);
};

binding.symlink = function(srcpath, dstpath, type, callback) {
  srcpath = possiblyRelative(srcpath);
  dstpath = possiblyRelative(dstpath);
  return executeWork(function() {
    // TODO: The node.js API allows for an optional 'type'
    // parameter that is only available on Windows. The
    // jnr-posix library does not (yet?) support this.
    if (posix.symlink(srcpath, dstpath) === -1) {
      return {err:posixError(srcpath, 'symlink')};
    }
  }.bind(this), callback);
};

binding.readlink = function(path, callback) {
  path = possiblyRelative(path);
  return executeWork(function() {
    var result = posix.readlink(path);
    if (result === null) return {err:posixError(path, 'readlink')};
    return {result:result};
  }.bind(this), callback);
};

binding.unlink = function(path, callback) {
  path = possiblyRelative(path);
  return executeWork(function() {
    if (posix.unlink(path) === -1) {
      return {err:posixError(path, 'unlink')};
    }
  }.bind(this), callback);
};

binding.chmod = function(path, mode, callback) {
  path = possiblyRelative(path);
  return executeWork(function() {
    if (posix.chmod(path, mode) === -1) {
      return {err:posixError(path, 'chmod')};
    }
  }.bind(this), callback);
};

binding.fchmod = function(fd, mode, callback) {
  return executeWork(function() {
    if (posix.fchmod(fd, mode) === -1) {
      return {err:posixError(fd, 'fchmod')};
    }
  }.bind(this), callback);
};

binding.chown = function(path, uid, gid, callback) {
  path = possiblyRelative(path);
  return executeWork(function() {
    if (posix.chown(path, uid, gid) === -1) {
      return {err:posixError(path, 'chown')};
    }
  }.bind(this), callback);
};

binding.fchown = function(fd, uid, gid, callback) {
  return executeWork(function() {
    if (posix.fchown(fd, uid, gid) === -1) {
      return {err:posixError(fd, 'fchown')};
    }
  }.bind(this), callback);
};

binding.utimes = function(path, atime, mtime, callback) {
  path = possiblyRelative(path);
  return executeWork(function() {
    if (posix.utimes(path, [atime], [mtime]) === -1) {
      return {err:posixError(path, 'utimes')};
    }
  }.bind(this), callback);
};

binding.futimes = function(fd, atime, mtime, callback) {
  return executeWork(function() {
    if (posix.futimes(fd, [atime], [mtime]) === -1) {
      return {err:posixError(fd, 'futimes')};
    }
  }.bind(this), callback);
};

binding.fsync = function(fd) {
  return executeWork(function() {
    if (posix.fsync(fd) === -1) {
      return {err:posixError(fd, 'fsync')};
    }
  }.bind(this), callback);
};

binding.fdatasync = function(fd) {
  return executeWork(function() {
    if (posix.fdatasync(fd) === -1) {
      return {err:posixError(fd, 'fdatasync')};
    }
  }.bind(this), callback);
};


function posixError(path, syscall) {
  var errno = posix.errno(),
      errEnum = Errno.valueOf(errno),
      e = new Error(errEnum.description());

  e.errno   = errno;
  e.path    = path;
  e.syscall = syscall;
  e.code    = errEnum.name();
  return e;
}
