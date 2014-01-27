var vertxTest = require('vertx_tests');
var vassert   = vertxTest.vassert;

var fs = require('fs');

vertxStop = function() {
  __files.forEach(function(f) {
    if (f.exists()) {
      f.delete();
    }
  });
};

var FsTests = {
  testRename: function() {
    var newFile = generateTempFileName('rename');
    setupTestFile(function(sut) {
      fs.rename(sut.getAbsolutePath(), newFile.getAbsolutePath(), function(e) {
        vassert.assertEquals(null, e);
        vassert.assertTrue(newFile.exists());
        vassert.testComplete();
      });
    });
  },

  testRenameSync: function() {
    var newFile = generateTempFileName('rename-sync');
    setupTestFile(function(sut) {
      fs.renameSync(sut.getAbsolutePath(), newFile.getAbsolutePath());
      vassert.assertTrue(newFile.exists());
      vassert.testComplete();
    });
  },

  testRenameNonExistentFile: function() {
    fs.rename("blarg", "/foo/bar", function(e) {
      if (e === undefined || e === null) {
        vassert.fail("Rename should deliver an exception with a non-existent file");
      }
    });
    vassert.testComplete();
  },

  testWriteFile: function() {
    var newFile = generateTempFileName('write-file');
    fs.writeFile(newFile.getAbsolutePath(), data, function (err) {
      vassert.assertTrue(!err);
      vassert.assertTrue(fs.existsSync(newFile.getAbsolutePath()));
      vassert.testComplete();
    });
  },

  testExists: function() {
    setupTestFile(function(sut) {
      fs.exists(sut.getAbsolutePath(), function(result) {
        vassert.assertEquals(true, result);
        fs.exists('/random/something', function(result) {
          vassert.assertEquals(false, result);
          vassert.testComplete();
        });
      });
    });
  },

  testExistsSync: function() {
    setupTestFile(function(sut) {
      vassert.assertTrue("File should exist", fs.existsSync(sut.getAbsolutePath()));
      vassert.assertTrue("File should not exist", !fs.existsSync('/random/something'));
      vassert.testComplete();
    });
  },

  testTruncate: function() {
    setupTestFile(function(sut) {
      fs.exists(sut.getAbsolutePath(), function(exists) {
        vassert.assertEquals(true, exists);
        vassert.assertTrue("File is incorrect size", data.length === sut.length());
        fs.truncate(sut.getAbsolutePath(), 6, function(err, result) {
          vassert.assertTrue("File is incorrect size", sut.length() === 6);
          vassert.testComplete();
        });
      });
    }, data);
  },

  testTruncateExtends: function() {
    setupTestFile(function(sut) {
      fs.truncate(sut.getAbsolutePath(), 1024, function(err, result) {
        vassert.assertTrue("File should exist: " + sut.getAbsolutePath(), sut.exists());
        vassert.assertTrue("File is incorrect size: " + sut.length(), sut.length() === 1024);
        vassert.testComplete();
      });
    });
  },

  testTruncateSync: function() {
    setupTestFile(function(sut) {
      vassert.assertTrue("File is incorrect size", data.length === sut.length());
      fs.truncateSync(sut.getAbsolutePath(), 6);
      vassert.assertTrue("File is incorrect size", sut.length() === 6);
      vassert.testComplete();
    }, data);
  },

  testFtruncate: function() {
    setupTestFile(function(sut) {
      vassert.assertTrue("File is incorrect size", data.length === sut.length());
        fs.ftruncate(sut.getAbsolutePath(), 6, function(err, result) {
        vassert.assertTrue("File is incorrect size", sut.length() === 6);
        vassert.testComplete();
      });
    }, data);
  },

  testFtruncateExtends: function() {
    setupTestFile(function(sut) {
      fs.ftruncate(sut.getAbsolutePath(), 1024, function(err, result) {
        vassert.assertTrue("File should exist: " + sut.getAbsolutePath(), sut.exists());
        vassert.assertTrue("File is incorrect size: " + sut.length(), sut.length() === 1024);
        vassert.testComplete();
      });
    });
  },

  testFtruncateSync: function() {
    setupTestFile(function(sut) {
      vassert.assertTrue("File is incorrect size", data.length === sut.length());
      fs.ftruncateSync(sut.getAbsolutePath(), 6);
      vassert.assertTrue("File is incorrect size", sut.length() === 6);
      vassert.testComplete();
    }, data);
  },

  testMkdir: function() {
    var newDirectory = new java.io.File(tempDir + "/waffle-recipes");
    fs.mkdir(newDirectory.getAbsolutePath(), 0755, function(e) {
      vassert.assertTrue(newDirectory.exists());
      newDirectory.delete();
      vassert.testComplete();
    });
  },

  testMkdirSync: function() {
    var newDirectory = new java.io.File(tempDir + "/waffle-recipes");
    fs.mkdirSync(newDirectory.getAbsolutePath(), 0755);
    vassert.assertTrue(newDirectory.exists());
    newDirectory.delete();
    vassert.testComplete();
  },

  testReaddir: function() {
    fs.readdir(tempDir, function(e,r) {
      vassert.assertTrue(r.length>0);
      vassert.testComplete();
    });
  },

  testOpenReadNotExists: function() {
    fs.open('some-non-file.txt', 'r', function(e, f) {
      vassert.assertTrue(e instanceof Error);
      vassert.testComplete();
    });
  },

  testOpenRead: function() {
    setupTestFile(function(sut) {
      fs.open(sut.getAbsolutePath(), 'r', null, function(e, f) {
        vassert.assertTrue(!e);
        vassert.testComplete();
      });
    });
   },

  testOpenReadWrite: function() {
    setupTestFile(function(sut) {
      fs.open(sut.getAbsolutePath(), 'r+', null, function(e, f) {
        vassert.assertTrue(!e);
        vassert.testComplete();
      });
    });
  },

  testOpenSyncReadNotExists: function() {
    try {
      var f = fs.openSync('some-non-file.txt', 'r');
    } catch(e) {
      vassert.assertTrue(!!e);
      vassert.testComplete();
    }
  },

  testOpenSyncRead: function() {
    setupTestFile(function(sut) {
      var f = fs.openSync(sut.getAbsolutePath(), 'r', null);
      vassert.assertTrue("ERROR: " + f, !!f);
      vassert.testComplete();
    });
   },

  testOpenSyncReadWrite: function() {
    setupTestFile(function(sut) {
      var f = fs.openSync(sut.getAbsolutePath(), 'r+', null);
      vassert.assertTrue(!!f);
      vassert.testComplete();
    });
  },

  testCloseError: function() {
    fs.close(null, function(e) {
      vassert.assertEquals("Don't know how to close null", e.message);
      vassert.testComplete();
    });
  },

  testClose: function() {
    setupTestFile(function(sut) {
      fs.open(sut.getAbsolutePath(), 'r+', null, function(e, f) {
        vassert.assertTrue(!e);
        fs.close(f, function(ex) {
          vassert.assertTrue(!e);
          vassert.testComplete();
        });
      });
    });
  },

  testCloseSync: function() {
    setupTestFile(function() {
      fs.closeSync(null);
      vassert.testComplete();
    });
  },

  testReadFile: function() {
    var contents = "American Cheese";
    setupTestFile(function(sut) {
      fs.readFile(sut.getAbsolutePath(), function(err, file) {
        vassert.assertEquals('object', typeof file);
        vassert.assertEquals(contents, file.toString('ascii'));
        vassert.testComplete();
      });
    }, contents);
  },

  testReadFileWithEncoding: function() {
    var contents = "American Cheese";
    setupTestFile(function(sut) {
      fs.readFile(sut.getAbsolutePath(), {encoding:'ascii'}, function(err, str) {
        vassert.assertEquals('string', typeof str);
        vassert.assertEquals(contents, str);
        vassert.testComplete();
      });
    }, contents);
  },

  testReadFileSync: function() {
    var contents = "American Cheese";
    setupTestFile(function(sut) {
      var result = fs.readFileSync(sut.getAbsolutePath());
      vassert.assertEquals('object', typeof result);
      vassert.assertEquals(contents, result.toString('ascii'));
      vassert.testComplete();
    }, contents);
  },

  testReadFileSyncWithEncoding: function() {
    var contents = "American Cheese";
    setupTestFile(function(sut) {
      var result = fs.readFileSync(sut.getAbsolutePath(), {encoding: 'ascii'});
      vassert.assertEquals('string', typeof result);
      vassert.assertEquals(contents, result);
      vassert.testComplete();
    }, contents);
  }
};

var generateTempFileName = function(name) {
  var f = java.io.File.createTempFile(name, '.txt');
  f.delete();
  return f;
};

var setupTestFile = function(func, data) {
  var tmpFile = java.io.File.createTempFile('nodyn-fs-test', '.txt');
  if (!data) {
    data = 'cheese';
  }
  fs.writeFile(tmpFile.getAbsolutePath(), data, function(err) {
    if (err) throw err;
    __files.push(tmpFile);
    func(tmpFile);
  });
};

var data    = 'To be or not to be';
var tempDir = java.lang.System.getProperty('java.io.tmpdir');
var __files = [];

vertxTest.startTests(FsTests);
