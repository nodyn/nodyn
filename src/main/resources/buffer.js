
var Buffer = module.exports.Buffer = function() {
  var that = this;
  var input = '';
  var encoding = 'utf8';

  that.delegate = new vertx.Buffer();

  that.length = 0;
  that._charsWritten = 0;
  argzerotype = typeof arguments[0];

  switch( argzerotype ) {
    case 'number':
      that.length = arguments[0];
      break;
    case 'string':
      input = arguments[0];
      that.length = input.length;
      break;
    case 'object':
      obj = arguments[0];
      // this is odd - can't seem to recognize 
      // arguments[0] as an Array when it is one
      // And is join really appropriate here?
      if (obj instanceof Array || obj.join) {
        input = obj.join('');
      } else {
        input = obj.toString();
      }
      that.length = input.length;
      break;
  }

  if ( typeof arguments[1] == 'string' ) {
    encoding = arguments[1];
  }

  // For now, let's not distinguish between SlowBuffer and
  // Buffer. We'll see if we need to do otherwise later.
  that.SlowBuffer = that;

  // Convert from node.js encoding names to java
  // If an encoding can't be found, return false.
  that.convertEncoding = function( encoding ) {
    switch( encoding ) {

      case 'utf8':
      case 'utf-8':
        return 'UTF-8';

      case 'ascii':
        return 'US-ASCII';

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return 'UTF-16LE';

      // TODO: support base64 and hex encoding 
      case 'base64':
      case'hex':
        return 'UTF-16LE'; // broken!
    }
    return false;
  }

  that.write = function(string, offset, length, encoding) {
    offset   = offset   || 0;
    length   = length   || string.length;
    encoding = encoding || 'utf8';

    if (length < string.length) {
      string = string.substring(0, length);
    }
    that.delegate.setString(offset, string, that.convertEncoding(encoding));

    // since Node.js buffers are array-like in nature, and we can't 
    // overload [] in Javascript, we have to do this.
    i = 0;
    while( i < length ) {
      that[i+offset] = string[i];
      i++;
    }
    that._charsWritten = length;

    // TODO: Fix Buffer.write() return values
    // This is just wrong. Buffer.write() should return the number of
    // characters written (in bytes), but we don't have any way to actually get
    // that information from vert.x. So for now, just return the buffer length.
    return that.delegate.length();
  }

  that.fill = function(value, offset, end) {
    offset = offset || 0;
    end    = end    || that.length;

    length = value.length;
    setter = that.delegate.setString.bind(that.delegate);

    if (typeof value == 'number') {
      setter = that.delegate.setLong.bind(that.delegate);
      length = 1;
    }

    for( i=offset; i<end; i = i+length) {
      setter(i, value);
    }
  }

  that.toString = function(encoding, start, end) {
    encoding = encoding || 'utf8';
    start = start || 0;
    end = end || that.delegate.length();
    return that.delegate.getString(start, end, that.convertEncoding(encoding));
  }

  that.toJSON = function() {
    // TODO: Implement Buffer.toJSON
  }

  if (input != null) {
    that.write(input, 0, that.length, encoding);
  }

}


