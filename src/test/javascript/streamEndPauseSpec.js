
describe("Zero length stream", function() {

  it("should emit end events", function() {
    var Readable = require('stream').Readable;
    var stream = new Readable();
    var calledRead = false;
    var gotEnd = false;

    waitsFor(function() { return calledRead && gotEnd; }, "End not emitted");
    stream._read = function() {
      expect(calledRead).toBe(false);
      calledRead = true;
      this.push(null);
    };

    stream.on('data', function() {
      throw new Error('should not ever get data');
    });
    stream.pause();

    setTimeout(function() {
      stream.on('end', function() {
        gotEnd = true;
      });
      stream.resume();
    });
  });
});
