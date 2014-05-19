load('./npm_modules.js');

__jvertx = org.vertx.java.core.VertxFactory.newVertx();

Nodyn = org.projectodd.nodyn;

nodyn     = {
  QueryString: Nodyn.util.QueryString.newQueryString(this)
};

__filename = (typeof __filename === 'undefined') ?
              'node.js' : __filename;
__dirname  = (typeof __dirname === 'undefined') ?
              java.lang.System.getProperty('user.dir') : __dirname;

process    = NativeRequire.require('process');
console    = NativeRequire.require('node_console');
Buffer     = require('buffer').Buffer;
SlowBuffer = Buffer.SlowBuffer;

require.loadJSON = function(file) {
  return JSON.parse(vertx.fileSystem.readFileSync(file).toString());
};

// Stdout and Stderr
stderr = java.lang.System.err;
stdout = java.lang.System.out;

setTimeout = function() {
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

  return __jvertx.setTimer(milliseconds, function() {
    callback.apply(callback, args);
  });
};

setInterval = function() {
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

  return __jvertx.setPeriodic(milliseconds, function() {
    callback.apply(callback, args);
  });
};

clearTimeout = function(id) {
  __jvertx.cancelTimer(id);
};

clearInterval = clearTimeout;


//console.log("Node.js ContextClassLoader:  "
//    + java.lang.System.identityHashCode(java.lang.Thread.currentThread().getContextClassLoader()));
