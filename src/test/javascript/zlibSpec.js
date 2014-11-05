var helper = require('./specHelper'),
    zlib = require('zlib');

describe('The zlib module', function() {

  beforeEach(function() {
    helper.testComplete(false);
  });

  it('should deflateraw and inflateraw a string', function() {
    waitsFor(helper.testComplete, "the test to complete", 8000);
    var str = 'Now is the winter of our discontent made glorious summer by this Son of York';
    var encoded = 'Fcu7DYAwEATRVrYiEiJCwAZOYK90H1l0z5GO5k0cEINfFUO6VwUPMBRFbGeG7mhrqTgfqjAMFq3ltr2JUs7sP1mo9wc=';
    zlib.deflateRaw(str, function(e,b) {
      expect(e).toBeFalsy();
      expect(b.toString('base64')).toBe(encoded);

      zlib.inflateRaw(b, function(ee, bb) {
        expect(ee).toBeFalsy();
        expect(bb.toString()).toBe(str);
        helper.testComplete(true);
      });
    });
  });

  it('should deflate and inflate a string', function() {
    waitsFor(helper.testComplete, "the test to complete", 8000);
    var str = 'Now is the winter of our discontent made glorious summer by this Son of York';
    var encoded = 'eJwVy7sNgDAQBNFWtiISIkLABk5gr3QfWXTPkY7mTRwQg18VQ7pXBQ8wFEVsZ4buaGupOB+qMAwWreW2vYlSzuw/Waj3BzTBG/I=';
    zlib.deflate(str, function(e,b) {
      expect(e).toBeFalsy();
      expect(b.toString('base64')).toBe(encoded);

      zlib.inflate(b, function(ee, bb) {
        expect(ee).toBeFalsy();
        expect(bb.toString()).toBe(str);
        helper.testComplete(true);
      });
    });
  });

  it('should gzip and gunzip a string', function() {
    waitsFor(helper.testComplete, "the test to complete", 8000);
    var str = 'Now is the winter of our discontent made glorious summer by this Son of York';
    var encoded = 'H4sIAAAAAAAAABXLuw2AMBAE0Va2IhIiQsAGTmCvdB9ZdM+RjuZNHBCDXxVDulcFDzAURWxnhu5oa6k4H6owDBat5ba9iVLO7D9ZqPcHFHvOTEwAAAA=';
    zlib.gzip(str, function(e,b) {
      expect(e).toBeFalsy();
      expect(b.toString('base64')).toBe(encoded);
      zlib.gunzip(b, function(ee, bb) {
        expect(ee).toBeFalsy();
        expect(bb.toString()).toBe(str);
        helper.testComplete(true);
      });
    });
  });

  it('should gunzip a file', function() {
    waitsFor(helper.testComplete, 'the test to complete', 8000);
    var fs = require('fs');
    var buf = fs.readFileSync(__dirname + "/zlibFixture.txt.gz");
    zlib.gunzip(buf, function(e, b) {
      expect(e).toBeFalsy();
      expect(b.toString()).toBe("This is a test file for zlib\n");
      helper.testComplete(true);
    });
  });

  it('should close', function() {
    waitsFor(helper.testComplete, 'the test to complete', 8000);
    zlib.gzip('hello', function(err, out) {
      var unzip = zlib.createGunzip();
      unzip.write(out);
      unzip.close(function() {
        helper.testComplete(true);
      });
    });
  });

  it('should throw on write after close', function() {
    waitsFor(helper.testComplete, 'the test to complete', 8000);
    zlib.gzip('hello', function(err, out) {
      var unzip = zlib.createGunzip();
      unzip.close(function() {
          try {
            unzip.write(out);
            this.fail("write should fail after close");
          } catch(e) {
            helper.testComplete(true);
          }
      });
    });
  });

  it('should fail if the dictionary is not found', function() {
    waitsFor(helper.testComplete, 'the test to complete', 8000);
    var stream = zlib.createInflate();
    stream.on('error', function(e) {
      expect(e.message).toBe('Missing dictionary');
      helper.testComplete(true);
    });
    // String "test" encoded with dictionary "dict".
    stream.write(Buffer([0x78,0xBB,0x04,0x09,0x01,0xA5]));
  });

  it('should fail if the dictionary is incorrect', function() {
    waitsFor(helper.testComplete, 'the test to complete', 8000);
    var stream = zlib.createInflate({ dictionary: Buffer('fail') });
    stream.on('error', function(e) {
      expect(e.message).toBe('Bad dictionary');
      helper.testComplete(true);
    });
    // String "test" encoded with dictionary "dict".
    stream.write(Buffer([0x78,0xBB,0x04,0x09,0x01,0xA5]));
  });

  it('should fail to gunzip with an error given bad input', function() {
    var nonStringInputs = [1, true, {a: 1}, ['a']];
    nonStringInputs.forEach(function(input) {
      // gunzip should not throw an error when called with bad input.
      try {
        zlib.gunzip(input, function(err, buffer) {
          // zlib.gunzip should pass the error to the callback.
          expect(err).toBeTruthy();
        });
      } catch(e) {
        this.fail('gunzip should not throw');
      }
    });
  });

  describe('node.js zlib tests', function() {
    xit('should work', function() {

      function checkComplete() {
        if (failures > 0) {
          this.fail(new Error('Unexpected data'));
          return true;
        }
        return done === total;
      }

      waitsFor(checkComplete, 'the node.js zlib tests to complete', 8000);
      var path = require('path');

      var zlibPairs =
          [[zlib.Deflate, zlib.Inflate],
           [zlib.Gzip, zlib.Gunzip],
           [zlib.Deflate, zlib.Unzip],
           [zlib.Gzip, zlib.Unzip],
           [zlib.DeflateRaw, zlib.InflateRaw]];
      zlibPairs = [[zlib.Deflate, zlib.Inflate]];//,
//      [zlib.Gzip, zlib.Gunzip]];

      // how fast to trickle through the slowstream
      var trickle = [128, 1024, 1024 * 1024];

      // tunable options for zlib classes.

      // several different chunk sizes
      var chunkSize = [128, 1024, 1024 * 16, 1024 * 1024];

      // this is every possible value.
      var level = [-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
      var windowBits = [8, 9, 10, 11, 12, 13, 14, 15];
      var memLevel = [1, 2, 3, 4, 5, 6, 7, 8, 9];
      var strategy = [0, 1, 2, 3, 4];

      // it's nice in theory to test every combination, but it
      // takes WAY too long.  Maybe a pummel test could do this?
      if (!process.env.PUMMEL) {
        trickle = [1024];
        chunkSize = [1024 * 16];
        level = [6];
        memLevel = [8];
        windowBits = [15];
        strategy = [0];
      }

      var fs = require('fs');
      var testFiles = ['person.jpg', 'elipses.txt', 'empty.txt'];
      testFiles = ['elipses.txt'];

      if (process.env.FAST) {
        zlibPairs = [[zlib.Gzip, zlib.Unzip]];
        testFiles = ['person.jpg'];
      }

      var tests = {};
      testFiles.forEach(function(file) {
        console.log('testing ' + path.resolve(__dirname, file));
        tests[file] = fs.readFileSync(path.resolve(__dirname, file));
      });

      var util = require('util');
      var stream = require('stream');


      // stream that saves everything
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


      function SlowStream(trickle) {
        stream.Stream.call(this);
        this.trickle = trickle;
        this.offset = 0;
        this.readable = this.writable = true;
      }

      util.inherits(SlowStream, stream.Stream);

      SlowStream.prototype.write = function() {
        throw new Error('not implemented, just call ss.end(chunk)');
      };

      SlowStream.prototype.pause = function() {
        console.log("SlowStream pause");
        this.paused = true;
        this.emit('pause');
      };

      SlowStream.prototype.resume = function() {
        console.log("SlowStream resume");
        var self = this;
        if (self.ended) return;
        self.emit('resume');
        if (!self.chunk) return;
        self.paused = false;
        emit();
        function emit() {
          if (self.paused) return;
          if (self.offset >= self.length) {
            self.ended = true;
            console.log("offset >= length: " + self.offset + " " + self.length);
            return self.emit('end');
          }
          var end = Math.min(self.offset + self.trickle, self.length);
          var c = self.chunk.slice(self.offset, end);
          self.offset += c.length;
          console.log("SlowStream emit data " + c);
          self.emit('data', c);
          process.nextTick(emit);
        }
      };

      SlowStream.prototype.end = function(chunk) {
        // walk over the chunk in blocks.
        console.log("SlowStream end " + chunk.toString());
        var self = this;
        self.chunk = chunk;
        self.length = chunk.length;
        self.resume();
        return self.ended;
      };



      // for each of the files, make sure that compressing and
      // decompressing results in the same data, for every combination
      // of the options set above.
      var failures = 0;
      var total = 0;
      var done = 0;

      Object.keys(tests).forEach(function(file) {
        var test = tests[file];
        chunkSize.forEach(function(chunkSize) {
          trickle.forEach(function(trickle) {
            windowBits.forEach(function(windowBits) {
              level.forEach(function(level) {
                memLevel.forEach(function(memLevel) {
                  strategy.forEach(function(strategy) {
                    zlibPairs.forEach(function(pair) {
                      var Def = pair[0];
                      var Inf = pair[1];
                      var opts = { level: level,
                        windowBits: windowBits,
                        memLevel: memLevel,
                        strategy: strategy };

                      total++;

                      var def = new Def(opts);
                      var inf = new Inf(opts);
                      var ss = new SlowStream(trickle);
                      var buf = new BufferStream();

                      // verify that the same exact buffer comes out the other end.
                      buf.on('data', function(c) {
                        var msg = file + ' ' +
                            chunkSize + ' ' +
                            JSON.stringify(opts) + ' ' +
                            Def.name + ' -> ' + Inf.name;
                        var ok = true;
                        for (var i = 0; i < Math.max(c.length, test.length); i++) {
                          if (c[i] !== test[i]) {
                            ok = false;
                            failures++;
                            break;
                          }
                        }
                        var testNum = ++done;
                        console.log("test num " + testNum);
                        if (ok) {
                          console.log('ok ' + (testNum) + ' ' + msg);
                        } else {
                          console.log('not ok ' + (testNum) + ' ' + msg);
                          console.log('  ...');
                          console.log('  testfile: ' + file);
                          console.log('  type: ' + Def.name + ' -> ' + Inf.name);
                          console.log('  position: ' + i);
                          console.log('  options: ' + JSON.stringify(opts));
                          console.log('  expect: ' + test[i]);
                          console.log('  actual: ' + c[i]);
                          console.log('  chunkSize: ' + chunkSize);
                          console.log('  ---');
                        }
                      });

                      // the magic happens here.
                      ss.pipe(def).pipe(inf).pipe(buf);
                      ss.end(test);
                    });
                  }); }); }); }); }); }); // sad stallman is sad.
      });
    });
  });
});
