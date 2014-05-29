var helper = require('specHelper');
var fs = require('fs');

describe("fs module", function() {

  var tmpFile,
      basedir,
      data = 'now is the winter of our discontent made glorious summer',
      tempDir = java.lang.System.getProperty('java.io.tmpdir');

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
    expect(newDirectory.exists()).toBe(false);
    expect(typeof fs.mkdirSync).toBe('function');
    fs.mkdirSync(basedir + "/waffle-recipes", 0755);
    expect(newDirectory.exists()).toBe(true);
    newDirectory.delete();
  });

  it("should have a mkdir() function", function() {
    var newDirectory = new java.io.File(basedir + "/waffle-recipes");
    newDirectory.delete();
    expect(typeof fs.mkdir).toBe('function');
    waitsFor(helper.testComplete, "the mkdir operation to complete", 5);
    fs.mkdir(basedir + "/waffle-recipes", 0755, function() {
      expect(newDirectory.exists()).toBe(true);
      newDirectory.delete();
      helper.testComplete(true);
    });
  });

  it("should have an rmdir function", function() {
    var dirname = basedir + "/waffle-recipes";
    var newDirectory = new java.io.File(dirname);
    waitsFor(helper.testComplete, "the rmdir operation to complete", 5);
    fs.mkdir(dirname, 0755, function() {
      expect(newDirectory.exists()).toBe(true);
      fs.rmdir(basedir + "/waffle-recipes", function() {
        expect(newDirectory.exists()).toBe(false);
        helper.testComplete(true);
      });
    });
  });

  it("should have a rmdirSync function", function() {
    var dirname = basedir + "/waffle-recipes";
    var newDirectory = new java.io.File(dirname);
    waitsFor(helper.testComplete, 5);
    fs.mkdir(dirname, 0755, function() {
      expect(newDirectory.exists()).toBe(true);
      fs.rmdirSync(dirname);
      expect(newDirectory.exists()).toBe(false);
      newDirectory.delete();
      helper.testComplete(true);
    });
  });

  it("should have a rename function", function() {
    var newFile = new java.io.File(basedir + "/granola.txt");
    waitsFor(helper.testComplete, "the rename operation to complete", 5);
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
    waitsFor(helper.testComplete, "the rename operation to complete", 5);
    fs.rename("blarg", basedir + "/granola.txt", function(e) {
      expect(new java.io.File(basedir + "/granola.txt").exists()).toBe(false);
      expect(e !== null).toBe(true);
      helper.testComplete(true);
    });
  });

  it("should have a writeFile function", function() {
    waitsFor(helper.testComplete, "the writeFile operation to complete", 5);
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

  it("should have an exists function", function() {
    waitsFor(helper.testComplete, "the exists() operation to complete", 5);
    expect(fs.exists(tmpFile.getAbsolutePath(), function(exists) {
      expect(exists).toBe(true);
      expect(fs.exists('/some/invalid/path', function(exists) {
        expect(exists).toBe(false);
        helper.testComplete(true);
      }));
    }));
  });

  it("should have an existsSync function", function() {
    expect(fs.existsSync(tmpFile.getAbsolutePath())).toBe(true);
    expect(fs.existsSync('/some/invalid/path')).toBe(false);
  });

  it("should have a truncate function", function() {
    waitsFor(helper.testComplete, "the truncate test to complete", 5);
    helper.writeFixture(function(sut) {
      fs.exists(sut.getAbsolutePath(), function(exists) {
        expect(exists).toBe(true);
        expect(sut.length()).toBe(data.length);
        fs.truncate(sut.getAbsolutePath(), 3, function(err, result) {
          expect(sut.length()).toBe(3);
          sut.delete();
          helper.testComplete(true);
        });
      });
    }, data);
  });

  it("should extend files with trunctate() as well as shorten them", function() {
    waitsFor(helper.testComplete, "the truncate test to complete", 5);
    helper.writeFixture(function(sut) {
      fs.truncate(sut.getAbsolutePath(), 1024, function(err, result) {
        expect(sut.exists()).toBe(true);
        expect(sut.length()).toBe(1024);
        sut.delete();
        helper.testComplete(true);
      });
    });
  });

  it("should provide synchronous truncate()", function() {
    fs.truncateSync(tmpFile.getAbsolutePath(), 6);
    expect(tmpFile.length()).toBe(6);
  });

  it("should provide ftruncate", function() {
    waitsFor(helper.testComplete, "the ftruncate test to complete", 5);
    helper.writeFixture(function(sut) {
      expect(sut.length()).toBe(data.length);
      fs.ftruncate(sut.getAbsolutePath(), 6, function(err, result) {
        expect(sut.length()).toBe(6);
        sut.delete();
        helper.testComplete(true);
      });
    }, data);
  });

  it("should extend files with ftrunctate() as well as shorten them", function() {
    waitsFor(helper.testComplete, "the ftruncate test to complete", 5);
    helper.writeFixture(function(sut) {
      fs.ftruncate(sut.getAbsolutePath(), 1024, function(err, result) {
        expect(sut.exists()).toBe(true);
        expect(sut.length()).toBe(1024);
        sut.delete();
        helper.testComplete(true);
      });
    });
  });

  it("should provide synchronous ftruncate()", function() {
    fs.ftruncateSync(tmpFile.getAbsolutePath(), 6);
    expect(tmpFile.length()).toBe(6);
  });

  it("should provide a mkdir function", function() {
    waitsFor(helper.testComplete, "the mkdir test to complete", 5);
    var newDirectory = new java.io.File(tempDir + "/waffle-recipes");
    fs.mkdir(newDirectory.getAbsolutePath(), 0755, function(e) {
      expect(newDirectory.exists()).toBe(true);
      newDirectory.delete();
      helper.testComplete(true);
    });
  });

  it("should provide a synchronous mkdir function", function() {
    var newDirectory = new java.io.File(tempDir + "/waffle-recipes");
    fs.mkdirSync(newDirectory.getAbsolutePath(), 0755);
    expect(newDirectory.exists()).toBe(true);
    newDirectory.delete();
  });

  it("should provide a readdir function", function() {
    waitsFor(helper.testComplete, "the readdir test to complete", 5);
    fs.readdir(tempDir, function(e,r) {
      expect(r.length).toBeGreaterThan(0);
      // make sure this thing behaves like a JS array
      expect((typeof r.forEach)).toBe('function');
      helper.testComplete(true);
    });
  });

  it("should provide a readdirSync function", function() {
    var r = fs.readdirSync(tempDir);
    expect(r.length).toBeGreaterThan(0);
    // make sure this thing behaves like a JS array
    expect((typeof r.forEach)).toBe('function');
  });

  it('should provide a read function', function() {
    var data = "One shouldn't let intellectuals play with matches";
    waitsFor(helper.testComplete, "the read test to complete", 5);
    helper.writeFixture(function(sut) {
      fs.open(sut.getAbsolutePath(), 'r', function(e,f) {
        var b = new Buffer('');
        fs.read(f, b, 0, data.length, 0, function(er, bytesRead, buffer) {
          expect(buffer.toString()).toBe(data);
          helper.testComplete(true);
        });
      });
    }, data);
  });

  describe("when opening files", function() {

    it("should error on open read if the file doesn't exist", function() {
      waitsFor(helper.testComplete, "the open read fails test to complete", 5);
      fs.open('some-non-file.txt', 'r', function(e, f) {
        expect(e instanceof Error).toBeTruthy();
        helper.testComplete(true);
      });
    });

    it("should open files for reading", function() {
      waitsFor(helper.testComplete, "the open files test to complete", 5);
      helper.writeFixture(function(sut) {
        fs.open(sut.getAbsolutePath(), 'r', function(e, f) {
          expect(e).toBeFalsy();
          sut.delete();
          helper.testComplete(true);
        });
      });
    });

    it("should open files for writing", function() {
      waitsFor(helper.testComplete, "the open files for writing test to complete", 5);
      helper.writeFixture(function(sut) {
        fs.open(sut.getAbsolutePath(), 'r+', null, function(e, f) {
          expect(e).toBeFalsy();
          sut.delete();
          helper.testComplete(true);
        });
      });
    });

    it("should provide an error if attempting to close null", function() {
      waitsFor(helper.testComplete, "the close callback to return an error", 5);
      fs.close(null, function(e) {
        expect(e.message).toBe("Don't know how to close null");
        helper.testComplete(true);
      });
    });

    it("should close", function() {
      waitsFor(helper.testComplete, "the close callback to finish", 5);
      helper.writeFixture(function(sut) {
        fs.open(sut.getAbsolutePath(), 'r+', null, function(e, f) {
          expect(!e).toBe(true);
          fs.close(f, function(ex) {
            expect(!ex).toBe(true);
            sut.delete();
            helper.testComplete(true);
          });
        });
      });
    });

    it("should be able to read a file contents", function() {
      waitsFor(helper.testComplete, "the readFile to complete", 5);
      var contents = "American Cheese";
      helper.writeFixture(function(sut) {
        fs.readFile(sut.getAbsolutePath(), function(err, file) {
          expect(typeof file).toBe('object');
          expect(file instanceof Buffer).toBe(true);
          expect(file.toString('ascii')).toBe(contents);
          sut.delete();
          helper.testComplete(true);
        });
      }, contents);
    });

    it("should be able to read a file using encoding", function() {
      waitsFor(helper.testComplete, "the readFile to complete", 5);
      var contents = "American Cheese";
      helper.writeFixture(function(sut) {
        fs.readFile(sut.getAbsolutePath(), {encoding:'ascii'}, function(err, str) {
          expect(typeof str).toBe('string');
          expect(str).toBe(contents);
          sut.delete();
          helper.testComplete(true);
        });
      }, contents);
    });

    describe("synchronously", function() {

      it("should error on openSync read if the file doesn't exist", function() {
        try {
          var f = fs.openSync('some-non-file.txt', 'r');
        } catch(e) {
          expect(e instanceof Error).toBeTruthy();
        }
      });

      it("should open files with openSync in write mode", function() {
        waitsFor(helper.testComplete, "the openSync write test to complete", 5);
        helper.writeFixture(function(sut) {
          var f = fs.openSync(sut.getAbsolutePath(), 'r+', null);
          expect(f).toBeTruthy();
          sut.delete();
          helper.testComplete(true);
        });
      });

      it("should open files with openSync in read mode", function() {
        waitsFor(helper.testComplete, "the openSync read test to complete", 5);
        helper.writeFixture(function(sut) {
          var f = fs.openSync(sut.getAbsolutePath(), 'r', null);
          expect(f).toBeTruthy();
          sut.delete();
          helper.testComplete(true);
        });
      });

      it("should close files synchronously", function() {
        helper.writeFixture(function(sut) {
          fs.open(sut.getAbsolutePath(), 'r+', null, function(e, f) {
            expect(!e).toBe(true);
            var ex = fs.closeSync(f);
            expect(!ex).toBe(true);
            sut.delete();
            helper.testComplete(true);
          });
        });
      });

      it("should close files synchronously, even non-filedescriptors", function() {
        var e = fs.closeSync(null);
        expect(e instanceof Error).toBeTruthy();
      });

      it("should be able to read a file", function() {
        waitsFor(helper.testComplete, "the read to complete", 5);
        var contents = "American Cheese";
        helper.writeFixture(function(sut) {
          var result = fs.readFileSync(sut.getAbsolutePath());
          expect(typeof result).toBe('object');
          expect(result.toString('ascii')).toBe(contents);
          sut.delete();
          helper.testComplete(true);
        }, contents);
      });

      it("should be able to read a file with encoding", function() {
        waitsFor(helper.testComplete, "the read to complete", 5);
        var contents = "American Cheese";
        helper.writeFixture(function(sut) {
          var result = fs.readFileSync(sut.getAbsolutePath(), {encoding: 'ascii'});
          expect(typeof result).toBe('string');
          expect(result).toBe(contents);
          sut.delete();
          helper.testComplete(true);
        }, contents);
      });

    });

  });

});
