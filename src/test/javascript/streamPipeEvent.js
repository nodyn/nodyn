var stream = require('stream');
var util = require('util');

function Writable() {
  this.writable = true;
  stream.Stream.call(this);
}
util.inherits(Writable, stream.Stream);

function Readable() {
  this.readable = true;
  stream.Stream.call(this);
}
util.inherits(Readable, stream.Stream);

describe("Stream pipe event", function() {
  it("should be emitted on pipe()", function() {
    waitsFor(function() {
      return passed;
    }, 3000);
    var passed = false;

    var w = new Writable();
    w.on('pipe', function(src) {
      passed = true;
    });
    var r = new Readable();
    r.pipe(w);
  });
});
