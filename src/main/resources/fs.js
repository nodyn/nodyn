
var Fs = function() {
  var fs = vertx.fileSystem;

  this.exists       = fs.exists.bind( vertx.fileSystem );
  this.readdir      = fs.readDir.bind(vertx.fileSystem);
  this.readdirSync  = fs.readDirSync.bind(vertx.fileSystem);
  this.rename       = fs.move.bind( vertx.fileSystem );
  this.renameSync   = fs.moveSync.bind( vertx.fileSystem );
  this.truncate     = fs.truncate.bind( vertx.fileSystem );
  this.truncateSync = fs.truncateSync.bind( vertx.fileSystem );

  this.exists = function(path, callback) {
    fs.exists(path, function(err, result) {
      if (callback) {
        callback(result);
      }
    });
  }

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
  }

  this.mkdir = function(path, mode, callback) {
    //for now we ignore the mode as vertx api expect a unix perms string
    //CreateParent boolean will always be false as NodeJS do not support this option
    vertx.fileSystem.mkdir(path, false, convertModeToString(mode), callback);
  }

  this.mkdirSync = function(path, mode) {
    vertx.fileSystem.mkdirSync(path, false, convertModeToString(mode));
  }

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
  }
   
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
  }

  var modeCache = {};
}

module.exports = new Fs()
