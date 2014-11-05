var Readable = require('_stream_readable');
var Writable = require('_stream_writable');
var util = require('util');

util.inherits(TestReadable, Readable);
function TestReadable(opt) {
  if (!(this instanceof TestReadable))
    return new TestReadable(opt);
  Readable.call(this, opt);
  this._ended = false;
}

TestReadable.prototype._read = function(n) {
  if (this._ended)
    this.emit('error', new Error('_read called twice'));
  this._ended = true;
  this.push(null);
};

util.inherits(TestWritable, Writable);
function TestWritable(opt) {
  if (!(this instanceof TestWritable))
    return new TestWritable(opt);
  Writable.call(this, opt);
  this._written = [];
}

TestWritable.prototype._write = function(chunk, encoding, cb) {
  this._written.push(chunk);
  cb();
};

describe("Piping a stream that's already ended", function() {

  it("should work", function() {
    waitsFor(function() {
      return (enderEnded === true) && (writableFinished === true);
    }, 4000);
    // this one should not emit 'end' until we read() from it later.
    var ender = new TestReadable();
    var enderEnded = false;
    var writableFinished = false;

    // what happens when you pipe() a Readable that's already ended?
    var piper = new TestReadable();
    // pushes EOF null, and length=0, so this will trigger 'end'
    piper.read();

    setTimeout(function() {
      ender.on('end', function() {
        enderEnded = true;
      });
      expect(enderEnded).toBe(false);
      var c = ender.read();
      expect(c).toBe(null);

      var w = new TestWritable();
      w.on('finish', function() {
        writableFinished = true;
      });
      piper.pipe(w);

    });
  });
});
