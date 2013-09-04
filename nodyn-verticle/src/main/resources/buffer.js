
var Buffer = module.exports.Buffer = nodyn.buffer;

// For now, let's not distinguish between SlowBuffer and
// Buffer. We'll see if we need to do otherwise later.
Buffer.prototype.SlowBuffer = Buffer;

Buffer.prototype.concat = function() {
  var args   = Array.prototype.slice.call(arguments, 0);
  var list   = args[0];
  var start  = 0;
  var buffer = new Buffer();

  if (list == undefined || list == null || list.length == 0) {
    return new Buffer();
  } else if (list.length == 1) {
    return list[0];
  }
  list.forEach( function(buff) {
    start = start + buff.copy(buffer, start);
  });
  return buffer;
}


