var helper = require('specHelper');
var fs = require('fs');

describe("fs.Stat", function() {

  it("should support isFile()", function() {
    waitsFor(helper.testComplete, "Stat isFile", 5); 
    helper.writeFixture(function(sut) {
      fs.stat(sut.getAbsolutePath(), function(err, stats) {
        expect(err).toBe(null);
        expect(stats).not.toBe(null);
        expect(stats.isFile()).toBeTruthy();
        sut.delete();
        helper.testComplete(true);
      });
    });
  });

  it("should support isDirectory()", function() {
    waitsFor(helper.testComplete, "Stat isFile", 5); 
    helper.writeFixture(function(sut) {
      fs.stat(sut.getParent(), function(err, stats) {
        expect(err).toBe(null);
        expect(stats).not.toBe(null);
        expect(stats.isDirectory()).toBeTruthy();
        sut.delete();
        helper.testComplete(true);
      });
    });
  });

  // TODO
  xit("should support isCharacterDevice()", function() {});

  // TODO
  xit("should support isBlockDevice()", function() {});

  // TODO
  xit("should support isFIFO()", function() {});

  // TODO
  xit("should support isSocket()", function() {});
});


