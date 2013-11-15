
var Fs = function() {
  var fs = require('vertx/file_system');

  this.readdir      = fs.readDir;
  this.readdirSync  = fs.readDirSync;
  this.rename       = fs.move;
  this.renameSync   = fs.moveSync;
  this.truncate     = fs.truncate;
  this.truncateSync = fs.truncateSync;

  this.exists = function(path, callback) {
    fs.exists(path, function(err, result) {
      if (callback) {
        callback(result);
      }
    });
  };

  this.writeFile = function() {
    filename = arguments[0];
    data     = arguments[1];
    callback = arguments[2];

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

  this.mkdir = function(path, mode, callback) {
    //for now we ignore the mode as vertx api expect a unix perms string
    //CreateParent boolean will always be false as NodeJS do not support this option
    fs.mkDir(path, false, convertModeToString(mode), callback);
  };

  this.mkdirSync = function(path, mode) {
    fs.mkDirSync(path, false, convertModeToString(mode));
  };

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

module.exports = new Fs();
