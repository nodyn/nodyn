var helper = require('specHelper');
var fs = require('fs');

describe("fs module", function() {

  var tmpFile, basedir;

  beforeEach(function() {
    tmpFile = java.io.File.createTempFile("pork-recipes", ".txt");
    basedir = tmpFile.getParent();
    helper.testComplete(false);
  });

  afterEach(function() {
    tmpFile.delete();
  });

  it("should have a mkdirSync() function", function(){
    var newDirectory = new java.io.File(basedir + "/waffle-recipes");
    expect(typeof fs.mkdirSync).toBe('function');
    fs.mkdirSync(basedir + "/waffle-recipes", 0755);
    expect(newDirectory.exists()).toBe(true);
    newDirectory.delete();
  });

  it("should have a mkdir() function", function() {
    var newDirectory = new java.io.File(basedir + "/waffle-recipes");
    newDirectory.delete();
    expect(typeof fs.mkdir).toBe('function');
    waitsFor(helper.testComplete, "the mkdir operation to complete", 100);
    fs.mkdir(basedir + "/waffle-recipes", 0755, function() {
      expect(newDirectory.exists()).toBe(true);
      newDirectory.delete();
      helper.testComplete(true);
    });
  });

  it("should have a rename function", function() {
    var newFile = new java.io.File(basedir + "/granola.txt");
    waitsFor(helper.testComplete, "the rename operation to complete", 100);
    fs.rename(tmpFile.getAbsolutePath(), basedir + "/granola.txt", function(e) {
      expect(e === null).toBe(true);
      expect(newFile.exists()).toBe(true);
      newFile.delete();
      helper.testComplete(true);
    });
  });

  it("should have a renameSync function", function() {
    var newFile = new java.io.File(basedir + "/granola.txt");
    fs.renameSync(tmpFile.getAbsolutePath(), basedir + "/granola.txt");
    expect(newFile.exists()).toBe(true);
    newFile.delete();
  });

  it("should fail with an error when renaming a non-existent file", function() {
    waitsFor(helper.testComplete, "the rename operation to complete", 100);
    fs.rename("blarg", basedir + "/granola.txt", function(e) {
      expect(new java.io.File(basedir + "/granola.txt").exists()).toBe(false);
      expect(e !== null).toBe(true);
      helper.testComplete(true);
    });
  });

  it ("should have a writeFile function", function() {
    waitsFor(helper.testComplete, "the writeFile operation to complete", 100);
    fs.writeFile(tmpFile.getAbsolutePath(),
      'Now is the winter of our discontent made glorious summer by this son of York',
      function (err) {
        if (err) throw err;
        fs.exists(tmpFile.getAbsolutePath(), function(exists) {
          expect(exists).toBe(true);
          helper.testComplete(true);
        });
      });
  });

});

