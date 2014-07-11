
var blocking = new io.nodyn.loop.Blocking(process.EVENT_LOOP);

module.exports.submit = function(task) {
  blocking.submit( task );
}

module.exports.unblock = function(fn) {
  return function() {
    var origArgs = arguments;
    blocking.unblock( function() {
      fn.apply( fn.this, origArgs );
    })
  }
}