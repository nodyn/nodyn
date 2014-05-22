var helper = require('specHelper');
var stream = require('stream');
var fs = require('fs');

describe("fs.createReadStream", function() {

  beforeEach(function() {
    helper.testComplete(false);
  });

  it("should return an fs.ReadStream", function() {
    waitsFor(helper.testComplete, 5);
    helper.writeFixture(function(f) {
      var readStream = fs.createReadStream(f.getAbsolutePath());
      expect(readStream).toBeTruthy();
      expect(readStream instanceof fs.ReadStream).toBeTruthy();
      expect(readStream instanceof stream.Readable).toBeTruthy();
      f.delete();
      helper.testComplete(true);
    });
  });

  // TODO: Node.js throws an uncatchable error?
  xit("should throw ENOENT when a file can't be found", function() {
    waitsFor(helper.testComplete, 5);
    try {
      fs.createReadStream('not-found.txt');
      this.fail('fs.createReadStream should fail with ENOENT');
    } catch(e) {
    }
  });

});

describe("fs.ReadStream", function() {

  beforeEach(function() {
    helper.testComplete(false);
  });

  it("should read files.", function() {
    var data = "Now is the winter of our discontent / " +
               "Made glorious summer by this son of York";
    waitsFor(helper.testComplete, 5);
    helper.writeFixture(function(f) {
      var result = '',
          readStream = fs.createReadStream(f.getAbsolutePath());

      readStream.on('data', function(chunk) {
        result += chunk;
      });

      readStream.on('end', function() {
        expect(result).toEqual(data);
        f.delete();
        helper.testComplete(true);
      });
    }, data);
  });

  it("should emit 'close' when it has been closed", function() {
    waitsFor(helper.testComplete, 5);
    helper.writeFixture(function(f) {
      var readStream = fs.createReadStream(f.getAbsolutePath());
      readStream.on('data', function(chunk) {
        readStream.on('close', function() {
          helper.testComplete(true);
        });
        readStream.close();
      });
    });
  });

  it("should emit 'close' when it has been destroyed", function() {
    waitsFor(helper.testComplete, 5);
    helper.writeFixture(function(f) {
      var readStream = fs.createReadStream(f.getAbsolutePath());
      readStream.on('data', function(chunk) {
        readStream.on('close', function() {
          helper.testComplete(true);
        });
        readStream.destroy();
      });
    });
  });

  it("should emit 'open' when the file has opened.", function() {
    var data = "Now is the winter of our discontent / " +
               "Made glorious summer by this son of York";
    waitsFor(helper.testComplete, 5);
    helper.writeFixture(function(f) {
      var result = '',
          readStream = fs.createReadStream(f.getAbsolutePath());

      readStream.on('open', function() {
        f.delete();
        helper.testComplete(true);
      });
    }, data);
  });

  xit("should read a subset of file data.", function() {
    var data = "Now is the winter of our discontent / " +
               "Made glorious summer by this son of York";
    waitsFor(helper.testComplete, 5);
    helper.writeFixture(function(f) {
      var result = '',
          readStream = fs.createReadStream(f.getAbsolutePath(),
            {start: 5, end: 20});

      readStream.on('data', function(chunk) {
        result += chunk;
      });

      readStream.on('end', function() {
        expect(result).toEqual("is the winter of");
        f.delete();
        helper.testComplete(true);
      });
    }, data);
  });
});
