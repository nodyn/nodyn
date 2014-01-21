var fs = require('vertx/file_system');

var Fs = function() {
  this.readdir       = fs.readDir;
  this.readdirSync   = fs.readDirSync;
  this.rename        = fs.move;
  this.renameSync    = fs.moveSync;
  this.truncate      = fs.truncate;
  this.truncateSync  = fs.truncateSync;
  this.ftruncate     = fs.truncate;
  this.ftruncateSync = fs.truncateSync;
  this.exists        = delegate(fs.exists);
  this.existsSync    = fs.existsSync;
  this.chown         = fs.chown;
  this.fchown        = this.chown;
  this.lchown        = this.chown;
  this.chownSync     = fs.chownSync;
  this.fchownSync    = this.chownSync;
  this.lchownSync    = this.chownSync;
  this.readlink      = fs.readSymlink;
  this.readlinkSync  = fs.readSymlinkSync;
  this.unlink        = fs.unlink;
  this.unlinkSync    = fs.unlinkSync;
  this.rmdir         = fs.delete;
  this.rmdirSync     = fs.deleteSync;

  // TODO: implement these functions
  this.realpath      = notImplemented("realpath", true);
  this.realpathSync  = notImplemented("realpathSync", true);
  this.close         = notImplemented("close");
  this.closeSync     = notImplemented("closeSync");

  this.open = function(path, flags) {
    var args = Array.prototype.slice.call(arguments, 2);
    var func = args.pop();
    var mode = args.pop();
    if (!mode) {
      mode = "666";
    }
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
      // TODO: Deal with append modes
    }
    var modeString = convertModeToString(mode);
    fs.open(path, flag, false, convertModeToString(mode), function(e, f) {
      if (e) {
        e = new Error(e.toString());
      }
      func.apply(func, [e, f]);
    });
  };

  this.writeFile = function() {
    var filename = arguments[0];
    var data     = arguments[1];
    var callback = arguments[2];

    // TODO: Actually use these values somehow
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

  this.chmod = function(path, mode, callback) {
    fs.chmod(path, convertModeToString(mode), callback);
  };
  this.fchmod = this.chmod;
  this.lchmod = this.chmod;

  this.chmodSync = function(path, mode) {
    fs.chmodSync(path, convertModeToString(mode));
  };
  this.fchmodSync = this.chmodSync;
  this.lchmodSync = this.chmodSync;


  this.mkdir = function(path, mode, callback) {
    // CreateParent boolean will always be false as NodeJS 
    // do not support this option
    fs.mkDir(path, false, convertModeToString(mode), callback);
  };

  this.mkdirSync = function(path, mode) {
    fs.mkDirSync(path, false, convertModeToString(mode));
  };

  this.stat = function(path, callback) {
    fs.props(path, function(err, result){
      callback(new Stat(result));
    });
  };

  this.statSync = function(path) {
    return new Stat(fs.propsSync(path));
  };

  this.lstat = function(path, callback) {
    fs.lprops(path, function(err, result){
      callback(new Stat(result));
    });
  };

  this.lstatSync = function(path) {
    return new Stat(fs.lpropsSync(path));
  };

  this.link = function(src, dest, callback) {
    fs.symlink(dest, src, callback);
  };

  this.linkSync = function(src, dest) {
    fs.symlinkSync(dest, src);
  };

  this.symlink = this.link;
  this.symlinkSync = this.linkSync;

  var invertAndConvert = function(x){
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
   
  var convertModeToString = function(mode) {
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

  var modeCache = {};
};

var Stat = function(delegate) {
  this.size  = delegate.size;
  this.atime = new Date(delegate.lastAccessTime);
  this.mtime = new Date(delegate.lastModifiedTime);
  this.ctime = new Date(delegate.creationTime);

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

var wrapHandler = function(func) {
  return function(err, result) {
    if (err) {
      return func(err);
    }
    return func(result);
  };
};

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

module.exports = new Fs();
