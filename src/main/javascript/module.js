

var path = require('path');
var Module = require('jvm-npm');

// 'from' is the __dirname of the module.
Module._nodeModulePaths = function(from) {
  // guarantee that 'from' is absolute.
  from = path.resolve(from);

  // note: this approach *only* works when the path is guaranteed
  // to be absolute.  Doing a fully-edge-case-correct path.split
  // that works on both Windows and Posix is non-trivial.
  var splitRe = process.platform === 'win32' ? /[\/\\]/ : /\//;
  var paths = [];
  var parts = from.split(splitRe);

  for (var tip = parts.length - 1; tip >= 0; tip--) {
    // don't search in .../node_modules/node_modules
    if (parts[tip] === 'node_modules') continue;
    var dir = parts.slice(0, tip + 1).concat('node_modules').join(path.sep);
    paths.push(dir);
  }

  return paths;
};


module.exports = Module;
