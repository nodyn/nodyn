var helper = require('specHelper'),
    stream = require('stream'),
    util   = require('util'),
    fs     = require('fs');

/*
describe("fs.WriteStream", function() {

  beforeEach(function() {
    helper.testComplete(false);
  });

  xit("should be returned from a call to fs.createWriteStream", function() {
    expect(fs.createWriteStream('write-stream-spec.txt') instanceof fs.WriteStream).toBeTruthy();
    fs.unlinkSync('write-stream-spec.txt');
  });

  xit("should be a Stream.Writable", function() {
    expect(fs.createWriteStream('write-stream-spec.txt') instanceof stream.Writable).toBeTruthy();
    fs.unlinkSync('write-stream-spec.txt');
  });

});
*/

describe("fs.ReadStream", function() {

  beforeEach(function() {
    helper.testComplete(false);
  });

  xit("should be returned from a call to fs.createReadStream", function() {
    waitsFor(helper.testComplete, 5000);
    helper.writeFixture(function(f) {
      var readStream = fs.createReadStream(f.getAbsolutePath());
      expect(readStream).toBeTruthy();
      expect(readStream instanceof fs.ReadStream).toBeTruthy();
      expect(readStream instanceof stream.Readable).toBeTruthy();
      f.delete();
      readStream.close();
      helper.testComplete(true);
    });
  });

  // TODO: Node.js throws an uncatchable error?
  xit("should throw ENOENT on a call to fs.createReadStream when a file can't be found", function() {
    waitsFor(helper.testComplete, 5000);
    try {
      fs.createReadStream('not-found.txt');
      // this.fail('fs.createReadStream should fail with ENOENT');
    } catch(e) {
      helper.testComplete(true);
    }
  });

  xit("should read files.", function() {
    var data = "Now is the winter of our discontent / " +
               "Made glorious summer by this son of York";
    waitsFor(helper.testComplete, 5000);
    helper.writeFixture(function(f) {
      var result = '',
          readStream = fs.createReadStream(f.getAbsolutePath());

      readStream.on('data', function(chunk) {
        result += chunk;
        print("1st test got data " + chunk)
      });

      readStream.on('end', function() {
        expect(result).toEqual(data);
        readStream.close();
        f.delete();
        helper.testComplete(true);
      });
    }, data);
  });

  it("should emit 'close' when it has been closed", function() {
    var data = "Now is the winter of our discontent / " +
               "Made glorious summer by this son of York";

    waitsFor(helper.testComplete, 5000);
    helper.writeFixture(function(f) {
      var result = '',
          readStream = fs.createReadStream(f.getAbsolutePath());

      readStream.on('data', function(chunk) {
        result += chunk;
        print("GOT DATA: " + chunk)
      });

      readStream.on('close', function() {
        print("CLOSE RESULT " + result)
        f.delete();
        helper.testComplete(true);
      });

      readStream.on('end', function() {
        expect(result).toEqual(data);
        readStream.close();
        // f.delete();
        // helper.testComplete(true);
      });
    }, data);
  });

  xit("should emit 'close' when it has been destroyed", function() {
    waitsFor(helper.testComplete, 5000);
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

  xit("should emit 'open' when the file has opened.", function() {
    var data = "Now is the winter of our discontent / " +
               "Made glorious summer by this son of York";
    waitsFor(helper.testComplete, 5000);
    helper.writeFixture(function(f) {
      var result = '',
          readStream = fs.createReadStream(f.getAbsolutePath());

      // how is this not a race condition?
      readStream.on('open', function() {
        f.delete();
        helper.testComplete(true);
      });
    }, data);
  });

  xit("should read a subset of file data.", function() {
    var data = "Now is the winter of our discontent / " +
               "Made glorious summer by this son of York";
    waitsFor(helper.testComplete, 5000);
    helper.writeFixture(function(f) {
      var result = '',
          readStream = fs.createReadStream(f.getAbsolutePath(),
            {start: 4, end: 20});

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
