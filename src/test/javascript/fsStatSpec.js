var helper = require('specHelper'),
    util   = require('util'),
    fs     = require('fs');

describe("fs.Stat", function() {
  beforeEach(function() {
    helper.testComplete(false);
  });

  it("should generate an error if the file is not found", function() {
    waitsFor(helper.testComplete, "Stat file", 5);
    fs.stat('invalidpath', function(err, stat) {
      expect(err instanceof Error).toBeTruthy();
      expect(err.code).toBe('ENOENT');
      expect(err.path).toBe('invalidpath');
      expect(err.syscall).toBe('stat');
      expect(stat).toBeFalsy();
      helper.testComplete(true);
    });
  });

  it("should support isFile()", function() {
    waitsFor(helper.testComplete, "Stat isFile", 5);
    helper.writeFixture(function(sut) {
      fs.stat(sut.getAbsolutePath(), function(err, stats) {
        expect(err).toBeFalsy();
        expect(stats).toBeTruthy();
        expect(stats.isFile()).toBeTruthy();
        sut.delete();
        helper.testComplete(true);
      });
    });
  });

  it("should support isDirectory()", function() {
    waitsFor(helper.testComplete, "Stat isDirectory", 5);
    helper.writeFixture(function(sut) {
      fs.stat(sut.getParent(), function(err, stats) {
        expect(err).toBeFalsy();
        expect(stats).toBeTruthy();
        expect(stats.isDirectory()).toBeTruthy();
        sut.delete();
        helper.testComplete(true);
      });
    });
  });

  it("should support isCharacterDevice()", function() {
    waitsFor(helper.testComplete, "Stat isCharacterDevice", 5);
    helper.writeFixture(function(sut) {
      fs.stat(sut.getAbsolutePath(), function(err, stats) {
        expect(err).toBeFalsy();
        expect(stats).toBeTruthy();
        expect(typeof stats.isCharacterDevice).toBe('function');
        sut.delete();
        helper.testComplete(true);
      });
    });
  });

  it("should support isBlockDevice()", function() {
    waitsFor(helper.testComplete, "Stat isBlockDevice", 5);
    helper.writeFixture(function(sut) {
      fs.stat(sut.getAbsolutePath(), function(err, stats) {
        expect(err).toBeFalsy();
        expect(stats).toBeTruthy();
        expect(typeof stats.isBlockDevice).toBe('function');
        sut.delete();
        helper.testComplete(true);
      });
    });
  });

  it("should support isFIFO()", function() {
    waitsFor(helper.testComplete, "Stat isFIFO", 5);
    helper.writeFixture(function(sut) {
      fs.stat(sut.getAbsolutePath(), function(err, stats) {
        expect(err).toBeFalsy();
        expect(stats).toBeTruthy();
        expect(typeof stats.isFIFO).toBe('function');
        sut.delete();
        helper.testComplete(true);
      });
    });
  });

  it("should support isSocket()", function() {
    waitsFor(helper.testComplete, "Stat isSocket", 5);
    helper.writeFixture(function(sut) {
      fs.stat(sut.getAbsolutePath(), function(err, stats) {
        expect(err).toBeFalsy();
        expect(stats).toBeTruthy();
        expect(typeof stats.isSocket).toBe('function');
        sut.delete();
        helper.testComplete(true);
      });
    });
  });
});


describe("fs.StatSync", function() {

  it("should generate an error if the file is not found", function() {
    try {
      fs.statSync('invalidpath');
    } catch(err) {
      expect(err instanceof Error).toBeTruthy();
      expect(err.code).toBe('ENOENT');
      expect(err.path).toBe('invalidpath');
      expect(err.syscall).toBe('stat');
    }
  });

  it("should support isFile()", function() {
    waitsFor(helper.testComplete, "Stat isFile", 5);
    helper.writeFixture(function(sut) {
      var stats = fs.statSync(sut.getAbsolutePath());
      expect(stats).toBeTruthy();
      expect(stats.isFile()).toBeTruthy();
      sut.delete();
      helper.testComplete(true);
    });
  });

  it("should support isDirectory()", function() {
    waitsFor(helper.testComplete, "Stat isFile", 5);
    helper.writeFixture(function(sut) {
      var stats = fs.statSync(sut.getParent());
      expect(stats).toBeTruthy();
      expect(stats.isDirectory()).toBeTruthy();
      sut.delete();
      helper.testComplete(true);
    });
  });

  it("should support isCharacterDevice()", function() {
    waitsFor(helper.testComplete, "Stat isCharDev", 5);
    helper.writeFixture(function(sut) {
      var stats = fs.statSync(sut.getAbsolutePath());
      expect(stats).toBeTruthy();
      expect(typeof stats.isCharacterDevice).toBe('function');
      sut.delete();
      helper.testComplete(true);
    });
  });

  it("should support isBlockDevice()", function() {
    waitsFor(helper.testComplete, "Stat isCharDev", 5);
    helper.writeFixture(function(sut) {
      var stats = fs.statSync(sut.getAbsolutePath());
      expect(stats).toBeTruthy();
      expect(typeof stats.isBlockDevice).toBe('function');
      sut.delete();
      helper.testComplete(true);
    });
  });

  it("should support isFIFO()", function() {
    waitsFor(helper.testComplete, "Stat isFifo", 5);
    helper.writeFixture(function(sut) {
      var stats = fs.statSync(sut.getAbsolutePath());
      expect(stats).toBeTruthy();
      expect(typeof stats.isFIFO).toBe('function');
      sut.delete();
      helper.testComplete(true);
    });
  });

  it("should support isSocket()", function() {
    waitsFor(helper.testComplete, "Stat isSocket", 5);
    helper.writeFixture(function(sut) {
      var stats = fs.statSync(sut.getAbsolutePath());
      expect(stats).toBeTruthy();
      expect(typeof stats.isSocket).toBe('function');
      sut.delete();
      helper.testComplete(true);
    });
  });
});
