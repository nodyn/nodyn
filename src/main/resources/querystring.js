var QueryString = function() {
  this._qs = nodyn.QueryString;

  this.escape = function(str) {
    return this._qs.escape(str)
  }

  this.unescape = function(str) {
    return this._qs.unescape(str)
  }

  this.stringify = function(obj, sep, eq) {
    return this._qs.stringify(obj, sep, eq)
  }

  this.parse = function(str, sep, eq, options) {
    return this._qs.parse(str, sep, eq, options)
  }
}

module.exports = new QueryString()
