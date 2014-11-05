var helper = require('./specHelper'),
    stream = require('stream'),
    util   = require('util');

describe('Stream transforms', function() {

  function IncrStream(opts) {
    if ((!this instanceof IncrStream)) return new IncrStream(opts);
    stream.Transform.call(this, opts);
    this.on('end', function() { console.log("END CALLED"); });
    this.on('finish', function() { console.log("FINISH CALLED"); });
  }
  util.inherits(IncrStream, stream.Transform);

  IncrStream.prototype._transform = function(chunk, enc, cb) {
    // xform the chunk
    var str = chunk.toString();
    var out = ++str;
    this.push(out.toString());
    this.emit('data', out.toString());
    this.emit('end');
    cb();
  };

  function BufferStream() {
    stream.Stream.call(this);
    this.chunks = [];
    this.length = 0;
    this.writable = true;
    this.readable = true;
  }

  util.inherits(BufferStream, stream.Stream);

  BufferStream.prototype.write = function(c) {
    console.log("BufferStream write " + c);
    this.chunks.push(c);
    this.length += c.length;
    return true;
  };

  BufferStream.prototype.end = function(c) {
    console.log("BufferStream end " + c);
    if (c) this.write(c);
    // flatten
    var buf = new Buffer(this.length);
    var i = 0;
    this.chunks.forEach(function(c) {
      c.copy(buf, i);
      i += c.length;
    });
    console.log("BufferStream emit data " + buf);
    this.emit('data', buf);
    this.emit('end');
    return true;
  };

  beforeEach(function() {
    helper.testComplete(false);
  });

  xit('should transform input', function() {
    waitsFor(helper.testComplete, 4000);
    var incrStream = new IncrStream();
    var buf = new BufferStream();
    incrStream.on('end', function() {
      expect(buf.toString()).toBe("101");
    });
    incrStream.pipe(buf);
    incrStream.end("100");
    setTimeout(function() {
      console.log("Timed out");
    }, 40000);
  });
});

