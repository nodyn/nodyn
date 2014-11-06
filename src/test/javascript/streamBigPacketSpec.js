var util = require('util'),
    stream = require('stream'),
    helper = require('./specHelper');

describe("Streaming big packets", function() {

  it("should work", function() {
    waitsFor(function() { 
      if (passed && later) {
        s1.emit('drain');
        return true;
      }
      return false;
    }, "the test to complete", 8000);
    var passed = false;
    var later = false;

    function PassThrough () {
      stream.Transform.call(this);
    }
    util.inherits(PassThrough, stream.Transform);
    PassThrough.prototype._transform = function (chunk, encoding, done) {
      later = chunk.toString() === 'later';
      this.push(chunk);
      done();
    };

    function TestStream () {
      stream.Transform.call(this);
    }
    util.inherits(TestStream, stream.Transform);
    TestStream.prototype._transform = function (chunk, encoding, done) {
      if (!passed) {
        // Char 'a' only exists in the last write
        passed = chunk.toString().indexOf('a') >= 0;
      }
      done();
    };

    var s1 = new PassThrough();
    var s2 = new PassThrough();
    var s3 = new TestStream();
    s1.pipe(s3);
    // Don't let s2 auto close which may close s3
    s2.pipe(s3, {end: false});

    // We must write a buffer larger than highWaterMark
    var big = new Buffer(s1._writableState.highWaterMark + 1);
    big.fill('x');

    // Since big is larger than highWaterMark, it will be buffered internally.
    expect(!s1.write(big)).toBeTruthy();
    // 'tiny' is small enough to pass through internal buffer.
    expect(s2.write('tiny')).toBeTruthy();

    // Write some small data in next IO loop, which will never be written to s3
    // Because 'drain' event is not emitted from s1 and s1 is still paused
    setImmediate(s1.write.bind(s1), 'later');
  });
});
