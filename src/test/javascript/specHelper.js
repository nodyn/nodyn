// Should only happen when running with a test-patter
// for a single spec. Otherwise, specRunner.js handles this.
if ((typeof nodyn) !== 'object') {
  load('./node.js');
  (function() {
    jasmine.WaitsForBlock.TIMEOUT_INCREMENT = 1;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 1;
    jasmineEnv = jasmine.getEnv();
    origCallback = jasmineEnv.currentRunner_.finishCallback;
    jasmineEnv.currentRunner_.finishCallback = function() {
      origCallback.call(this);
      process.exit();
    };
  })();
}

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
