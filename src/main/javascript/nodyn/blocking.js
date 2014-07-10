
var blocking = new io.nodyn.loop.Blocking(process.EVENT_LOOP);

module.exports.submit = function(task) {
  blocking.submit( task );
}

module.exports.unblock = function(fn) {
  return function() {
    System.err.println( "calling unblocked: " + arguments.length );
    var origArgs = arguments;
    blocking.unblock( function() {
      fn.apply( fn.this, origArgs );
    })
  }
}