var QueryStringDecoder = io.netty.handler.codec.http.QueryStringDecoder,
    QueryString = {};

QueryString.escape = function(str) {
  return java.net.URLEncoder.encode(str, "UTF-8");
};

QueryString.unescape = function(str) {
  return java.net.URLDecoder.decode(str, "UTF-8");
};

QueryString.stringify = function(obj, sep, eq) {
  obj = obj || {};
  sep = sep || '&';
  eq  = eq  || '=';

  var escapedName, value, pairs = [];

  function kv(name, value) {
    return [QueryString.escape(name), QueryString.escape(value)].join(eq);
  }

  for (var key in obj) {
    value = obj[key];
    if (value instanceof Array) {
      for (var i=0; i < value.length; ++i) {
        pairs.push(kv(key, value[i]));
      }
    } else {
      pairs.push(kv(key, value));
    }
  }
  return pairs.join(sep);
};

QueryString.parse = function(str, sep, eq, options) {
  if (sep && sep !== '&') str = str.replace(new RegExp(sep, 'g'), '&');
  if (eq  && eq  !== '=') str = str.replace(new RegExp(eq, 'g'),  '=');

  var parameters = new QueryStringDecoder('?'+str).parameters(),
      keys = parameters.keySet().toArray(),
      obj = {};

  for (var i=0; i<keys.length; ++i) {
    var key = keys[i],
        values = parameters.get(key);
    if (values.size() == 1) {
        obj[key] = values.get(0);
    } else {
        obj[key] = values.toArray();
    }
  }
  return obj;
};

module.exports = QueryString;
