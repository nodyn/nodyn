var vertxTest = require('vertx_tests');
var vassert   = vertxTest.vassert;

var fs = require('fs');
var tmpFile = java.io.File.createTempFile("pork-recipes", ".txt");
var basedir = tmpFile.getParent();
var newFile = new java.io.File(basedir + "/granola.txt");
var newDirectory = new java.io.File(basedir + "/waffle-recipes");

var FsTests = {
  testRename: function() {
    newFile.delete(); 
    fs.rename(tmpFile.getAbsolutePath(), basedir + "/granola.txt", function(e) {
      vassert.assertTrue(e == null);
      vassert.assertTrue(newFile.exists());
      vassert.testComplete();
    });
  },

  testRenameSync: function() {
    newFile.delete(); 
    fs.renameSync(tmpFile.getAbsolutePath(), basedir + "/granola.txt");
    vassert.assertTrue(newFile.exists());
    vassert.testComplete();
  },

  testRenameNonExistentFile: function() {
    newFile.delete(); 
    fs.rename("blarg", basedir + "/granola.txt", function(e) {
      vassert.assertFalse(newFile.exists());
      if (e == null) {
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
          // TODO: Check the size and then remove the file
          // But wait! no way to check the size in vert.x
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

  testTruncate: function() {
    vassert.testComplete();
  },

  testTruncateSync: function() {
    vassert.testComplete();
  },

  testMkdir: function() {
    newDirectory.delete();
    fs.mkdir(basedir + "/waffle-recipes", 0755, function(e) {
      vassert.assertTrue(newDirectory.exists());
      vassert.testComplete();
    })
  },

  testMkdirSync: function() {
    newDirectory.delete();
    fs.mkdirSync(basedir + "/waffle-recipes", 0755);
    vassert.assertTrue(newDirectory.exists());
    vassert.testComplete();
  },

  testReaddir: function() {
    fs.readdir(basedir, function(e,r) {
      vassert.assertTrue(r.length>0);
      vassert.testComplete();
    })
  }
}

vertxTest.startTests(FsTests);
