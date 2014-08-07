
module.exports.alloc = function(obj, len, type) {
  return io.nodyn.smalloc.Smalloc.alloc(obj, len);
}

module.exports.truncate = function(obj, len) {
  return io.nodyn.smalloc.Smalloc.truncate(obj, len);
}

module.exports.sliceOnto = function(src, dest, start, end) {
  return io.nodyn.smalloc.Smalloc.sliceOnto(src, dest, start, end);
}

module.exports.kMaxLength = 64 * 1024;
