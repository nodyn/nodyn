var Duplex = require('stream').Transform;

describe("Duplex streams in object mode", function() {
  it("should work", function() {

    waitsFor(function() {
      return (read.val === 1 && written.val === 2);
    }, 4000);
    var stream = new Duplex({ objectMode: true });

    expect(stream._readableState.objectMode).toBeTruthy();
    expect(stream._writableState.objectMode).toBeTruthy();

    var written;
    var read;

    stream._write = function (obj, _, cb) {
      written = obj;
      cb();
    };

    stream._read = function () {};

    stream.on('data', function (obj) {
      read = obj;
    });

    stream.push({ val: 1 });
    stream.end({ val: 2 });

  });
});
