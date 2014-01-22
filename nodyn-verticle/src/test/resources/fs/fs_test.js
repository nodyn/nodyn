var vertxTest = require('vertx_tests');
var vassert   = vertxTest.vassert;

var fs = require('fs');
var tmpFile = java.io.File.createTempFile("pork-recipes", ".txt");
var basedir = tmpFile.getParent();
var newFile = new java.io.File(basedir + "/granola.txt");
var newDirectory = new java.io.File(basedir + "/waffle-recipes");

vertxStop = function() {
  newFile.delete();
  newDirectory.delete();
};

var FsTests = {
  testRename: function() {
    fs.rename(tmpFile.getAbsolutePath(), basedir + "/granola.txt", function(e) {
      vassert.assertEquals(null, e);
      vassert.assertTrue(newFile.exists());
      vassert.testComplete();
    });
  },

  testRenameSync: function() {
    fs.renameSync(tmpFile.getAbsolutePath(), basedir + "/granola.txt");
    vassert.assertTrue(newFile.exists());
    vassert.testComplete();
  },

  testRenameNonExistentFile: function() {
    fs.rename("blarg", basedir + "/granola.txt", function(e) {
      vassert.assertFalse(newFile.exists());
      if (e === undefined || e === null) {
        vassert.fail("Rename should deliver an exception with a non-existent file");
      }
    });
    vassert.testComplete();
  },

  testWriteFile: function() {
    fs.writeFile(tmpFile.getAbsolutePath(),
      'Now is the winter of our discontent made glorious summer by this son of York',
      function (err) {
        if (err) throw err;
        fs.exists(tmpFile.getAbsolutePath(), function(exists) {
          vassert.assertEquals(true, exists);
          vassert.testComplete();
        });
      });
  },

  testExists: function() {
    fs.exists(tmpFile.getAbsolutePath(), function(result) {
      vassert.assertEquals(true, result);
      fs.exists('/random/something', function(result) {
        vassert.assertEquals(false, result);
        vassert.testComplete();
      });
    });
  },

  testExistsSync: function() {
    vassert.assertTrue("File should exist", fs.existsSync(tmpFile.getAbsolutePath()));
    vassert.assertTrue("File should not exist", !fs.existsSync('/random/something'));
    vassert.testComplete();
  },

  testTruncate: function() {
    var data = 'Now is the winter of our discontent made glorious summer by this son of York';
    fs.writeFile(tmpFile.getAbsolutePath(), data, function (err) {
      if (err) throw err;
      fs.exists(tmpFile.getAbsolutePath(), function(exists) {
        vassert.assertEquals(true, exists);
        vassert.assertTrue("File is incorrect size: " + tmpFile.length(), data.length === tmpFile.length());
        fs.truncate(tmpFile.getAbsolutePath(), 6, function(err, result) {
          vassert.assertTrue("File is incorrect size: " + tmpFile.length(), tmpFile.length() === 6);
          vassert.testComplete();
        });
      });
    });
  },

  testTruncateExtends: function() {
    fs.truncate(tmpFile.getAbsolutePath(), 1024, function(err, result) {
      vassert.assertTrue("File should exist: " + tmpFile.getAbsolutePath(), tmpFile.exists());
      vassert.assertTrue("File is incorrect size: " + tmpFile.length(), tmpFile.length() === 1024);
      vassert.testComplete();
    });
  },

  testTruncateSync: function() {
    var data = 'Now is the winter of our discontent made glorious summer by this son of York';
    fs.writeFile(tmpFile.getAbsolutePath(), data, function (err) {
      if (err) throw err;
      fs.exists(tmpFile.getAbsolutePath(), function(exists) {
        vassert.assertEquals(true, exists);
        vassert.assertTrue("File is incorrect size: " + tmpFile.length(), data.length === tmpFile.length());
        fs.truncateSync(tmpFile.getAbsolutePath(), 6);
        vassert.assertTrue("File is incorrect size: " + tmpFile.length(), tmpFile.length() === 6);
        vassert.testComplete();
      });
    });
  },

  testFtruncate: function() {
    var data = 'Now is the winter of our discontent made glorious summer by this son of York';
    fs.writeFile(tmpFile.getAbsolutePath(), data, function (err) {
      if (err) throw err;
      fs.exists(tmpFile.getAbsolutePath(), function(exists) {
        vassert.assertEquals(true, exists);
        vassert.assertTrue("File is incorrect size: " + tmpFile.length(), data.length === tmpFile.length());
        fs.ftruncate(tmpFile.getAbsolutePath(), 6, function(err, result) {
          vassert.assertTrue("File is incorrect size: " + tmpFile.length(), tmpFile.length() === 6);
          vassert.testComplete();
        });
      });
    });
  },

  testFtruncateExtends: function() {
    fs.ftruncate(tmpFile.getAbsolutePath(), 1024, function(err, result) {
      vassert.assertTrue("File should exist: " + tmpFile.getAbsolutePath(), tmpFile.exists());
      vassert.assertTrue("File is incorrect size: " + tmpFile.length(), tmpFile.length() === 1024);
      vassert.testComplete();
    });
  },

  testFtruncateSync: function() {
    var data = 'Now is the winter of our discontent made glorious summer by this son of York';
    fs.writeFile(tmpFile.getAbsolutePath(), data, function (err) {
      if (err) throw err;
      fs.exists(tmpFile.getAbsolutePath(), function(exists) {
        vassert.assertEquals(true, exists);
        vassert.assertTrue("File is incorrect size: " + tmpFile.length(), data.length === tmpFile.length());
        fs.ftruncateSync(tmpFile.getAbsolutePath(), 6);
        vassert.assertTrue("File is incorrect size: " + tmpFile.length(), tmpFile.length() === 6);
        vassert.testComplete();
      });
    });
  },

  testMkdir: function() {
    fs.mkdir(basedir + "/waffle-recipes", 0755, function(e) {
      vassert.assertTrue(newDirectory.exists());
      vassert.testComplete();
    });
  },

  testMkdirSync: function() {
    fs.mkdirSync(basedir + "/waffle-recipes", 0755);
    vassert.assertTrue(newDirectory.exists());
    vassert.testComplete();
  },

  testReaddir: function() {
    fs.readdir(basedir, function(e,r) {
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
};

var setupTestFile = function(func) {
  fs.writeFile(tmpFile.getAbsolutePath(), 'cheese', function(err) {
    if (err) throw err;
    func(tmpFile);
  });
};

vertxTest.startTests(FsTests);
