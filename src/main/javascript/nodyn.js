var util          = require('util');
var EventEmitter  = require('events').EventEmitter;

function arrayConverter(javaArray) {
  if ( ! javaArray ) {
    return undefined;
  }
  var arry = [];
  for (var i = 0; i < javaArray.length; i++) {
    arry.push(javaArray[i]);
  }
  return arry;
}
module.exports.arrayConverter = arrayConverter;

function exportEnums(scope, _enum) {
  for(var i=0; i<_enum.length; i++) {
    scope[_enum[i]] = _enum[i].ordinal();
  }
}
module.exports.exportEnums = exportEnums;

function notImplemented(name, throws) {
  return function() {
    var msg = ["Error:", name, "not implemented"].join(' ');
    print(msg);
    if (throws) {
      throw new Error(msg);
    }
  };
}
module.exports.notImplemented = notImplemented;
