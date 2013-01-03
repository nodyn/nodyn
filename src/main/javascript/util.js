function s (str) {
  // Based on s.js by Guillermo Rauch
  // https://github.com/guille/s.js
  var i = 1, args = arguments;
  return String(str).replace(/%?%(d|s|j)/g, function (symbol, type) {
    if ('%' == symbol[1]) return symbol;
      var arg = args[i++];
      switch (type) {
        case 'd': return Number(arg);
        case 'j': return JSON.stringify(arg);
      }
      return String(arg);
  });
};

var Util = function() {
  this.format = s
}

module.exports = new Util();
