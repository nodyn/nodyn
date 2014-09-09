var helper = require('./specHelper'),
    util = require('util'),
    fs = require('fs');

describe("fs.watch", function() {
  var tmpDir  = java.lang.System.getProperty('java.io.tmpdir'),
      tmpFile = tmpDir + '/fs-watch-spec.tmp';

  beforeEach(function() {
    helper.testComplete(false);
  });

  xit('should recive change events', function() {
    waitsFor(helper.testComplete, "fs.watch", 5000);
    fs.writeFileSync(tmpFile, 'change event: ');
    fs.watch(tmpFile, function(evt, filename) {
      expect(evt).toBe('create');
      expect(filename).toBe('fs-watch-spec.tmp');
      fs.unlinkSync(tmpFile);
      helper.testComplete(true);
    });
    fs.appendFileSync(tmpFile, 'changed');
  });
});


