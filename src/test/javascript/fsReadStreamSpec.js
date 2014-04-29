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
      var readStream = fs.createReadStream('sample.txt');
      expect(readStream).toBeTruthy();
      expect(readStream instanceof fs.ReadStream).toBeTruthy();
      expect(readStream instanceof stream.Readable).toBeTruthy();
      f.delete();
      helper.testComplete(true);
    });
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
