load("vertx_tests.js");

var fs = require('fs');
var tmpFile = java.io.File.createTempFile("pork-recipes", ".txt");
var basedir = tmpFile.getParent();
var newFile = new java.io.File(basedir + "/granola.txt");

function testRename() {
  newFile.delete(); 
  fs.rename(tmpFile.getAbsolutePath(), basedir + "/granola.txt", function(e) {
    vassert.assertTrue(e == null);
    vassert.assertTrue(newFile.exists());
    vassert.testComplete();
  });
}

function testRenameSync() {
  newFile.delete(); 
  fs.renameSync(tmpFile.getAbsolutePath(), basedir + "/granola.txt");
  vassert.assertTrue(newFile.exists());
  vassert.testComplete();
}

function testRenameNonExistentFile() {
  newFile.delete(); 
  fs.rename("blarg", basedir + "/granola.txt", function(e) {
    vassert.assertFalse(newFile.exists());
    if (e == null) {
      vassert.fail("Rename should deliver an exception with a non-existent file");
    }
  });
  vassert.testComplete();
}

function testWriteFile() {
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
}

function testExists() {
  fs.exists(tmpFile.getAbsolutePath(), function(result) {
    vassert.assertEquals(true, result);
    fs.exists('/random/something', function(result) {
      vassert.assertEquals(false, result);
      vassert.testComplete();
    });
  });
}

function testTruncate() {
  vassert.testComplete();
}

function testTruncateSync() {
  vassert.testComplete();
}

initTests(this);


