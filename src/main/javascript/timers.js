function setTimeout() {
  var handle = process.EVENT_LOOP.newHandle();
  var args = Array.prototype.slice.call(arguments);

  if (typeof args[0] != 'function') {
    throw "setTimeout requires a callback function as the first argument";
  }
  if (typeof args[1] != 'number') {
    throw "setTimeout requires a number as the second argument";
  }
  var callback = args[0];
  var milliseconds = args[1];
  if (milliseconds === 0) milliseconds = 1;

  args.shift();  // shuffle off the func
  args.shift();  // shuffle off the timeout


  var id = process.context.setTimer(milliseconds, function() {
    callback.apply(callback, args);
    process.EVENT_LOOP.decrCount();
  });

  return createTimerHandle(id, handle);
}

function clearTimeout(handle) {
  process.context.cancelTimer(handle.id);
  handle.unref();
}

function setInterval() {
  var handle = process.EVENT_LOOP.newHandle();
  var args = Array.prototype.slice.call(arguments);

  if (typeof args[0] != 'function') {
    throw "setInterval requires a callback function as the first argument";
  }
  if (typeof args[1] != 'number') {
    throw "setInterval requires a number as the second argument";
  }
  callback = args[0];
  milliseconds = args[1];

  args.shift();  // shuffle off the func
  args.shift();  // shuffle off the timeout

  var id = process.context.setPeriodic(milliseconds, function() {
    callback.apply(callback, args);
  });
  return createTimerHandle(id, handle);
}

function setImmediate(callback) {
  var args = Array.prototype.slice.call(arguments, 1);
  return setTimeout(function() {
    callback.apply(callback, args);
  }, 0);
}

function createTimerHandle(id, handle) {
  return {
    id: id,
    handle: handle,
    unref: function() {
      handle.unref();
    },
    ref: function() {
      handle.ref(); // io.nodyn.netty.RefHandle#ref is idempotent
    }
  };
}

module.exports.setTimeout     = setTimeout;
module.exports.clearTimeout   = clearTimeout;
module.exports.setInterval    = setInterval;
module.exports.clearInterval  = clearTimeout;
module.exports.setImmediate   = setImmediate;
module.exports.clearImmediate = clearTimeout;
