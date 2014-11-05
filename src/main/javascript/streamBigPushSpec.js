var stream = require('stream');

describe("Streams reading a lot of data", function() {

  it("should respect the high water mark for reads", function() {
    waitsFor(function() {
      return eofed && ended && (reads === 2);
    }, 4000);

    var str = 'asdfasdfasdfasdfasdf';

    var r = new stream.Readable({
      highWaterMark: 5,
      encoding: 'utf8'
    });

    var reads = 0;
    var eofed = false;
    var ended = false;

    r._read = function(n) {
      if (reads === 0) {
        setTimeout(function() {
          r.push(str);
        });
        reads++;
      } else if (reads === 1) {
        var ret = r.push(str);
        expect(ret).toBeFalsy();
        reads++;
      } else {
        expect(eofed).toBeFalsy();
        eofed = true;
        r.push(null);
      }
    };

    r.on('end', function() {
      ended = true;
    });

    // push some data in to start.
    // we've never gotten any read event at this point.
    var ret = r.push(str);
    // should be false.  > hwm
    expect(ret).toBeFalsy();
    var chunk = r.read();
    expect(chunk).toBe(str);
    chunk = r.read();
    expect(chunk).toBe(null);

    r.once('readable', function() {
      // this time, we'll get *all* the remaining data, because
      // it's been added synchronously, as the read WOULD take
      // us below the hwm, and so it triggered a _read() again,
      // which synchronously added more, which we then return.
      chunk = r.read();
      expect(chunk).toBe(str + str);

      chunk = r.read();
      expect(chunk).toBe(null);
    });

  });
});
