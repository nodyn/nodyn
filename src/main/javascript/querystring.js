var QueryString = {};

QueryString.escape = function(str) {
  return nodyn.QueryString.escape(str);
};

QueryString.unescape = function(str) {
  return nodyn.QueryString.unescape(str);
};

QueryString.stringify = function(obj, sep, eq) {
  obj = obj || {};
  sep = sep || '&';
  eq  = eq  || '=';
  return nodyn.QueryString.stringify(obj, sep, eq);
};

QueryString.parse = function(str, sep, eq, options) {
  sep = sep || '&';
  eq  = eq  || '=';
  return nodyn.QueryString.parse(str, sep, eq);
};

module.exports = QueryString;
