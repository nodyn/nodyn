// We need to prime vertx since jasmine tests don't run in the vert.x container.
// Only do this one time
// TODO: Find a better way to determine if we've loaded than checking NativeRequire
if ((typeof NativeRequire) !== 'object') {
  __jvertx = org.vertx.java.core.VertxFactory.newVertx();
  load('./npm_modules.js');
  load('./node.js');
}

// jasmine's fake clock thinks it's using milliseconds,
// but in fact it's using seconds. Set the timeout increment
// to one second.
jasmine.WaitsForBlock.TIMEOUT_INCREMENT = 1;
jasmine.DEFAULT_TIMEOUT_INTERVAL = 1;
var fs = require('fs');

(function() {
  var Helper = function() {
    __complete = false;

    this.testComplete = function(complete) {
      if (typeof complete === 'boolean') {
        __complete = complete;
      }
      return __complete;
    };

    this.writeFixture  = function(func, data) {
      var tmpFile = java.io.File.createTempFile('nodyn-spec', '.txt');
      if (!data) {
        data = 'This is a fixture file used for testing. It may be deleted.';
      }
      fs.writeFile(tmpFile.getAbsolutePath(), data, function(err) {
        if (err) throw err;
        func(tmpFile);
      });
    };

  };

  module.exports = new Helper();
})();
