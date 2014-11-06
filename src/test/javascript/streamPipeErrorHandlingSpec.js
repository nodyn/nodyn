var Stream = require('stream').Stream;

describe("Stream pipe error handling", function() {
  it("should catch and emit errors if there is an error listener", function() {
    var source = new Stream();
    var dest = new Stream();

    source.pipe(dest);

    var gotErr = null;
    source.on('error', function(err) {
      gotErr = err;
    });

    var err = new Error('This stream turned into bacon.');
    source.emit('error', err);
    expect(gotErr).toBe(err);
  });

  it("should throw an Error if there are no error listeners", function() {
    var source = new Stream();
    var dest = new Stream();

    source.pipe(dest);

    var err = new Error('This stream turned into bacon.');

    var gotErr = null;
    try {
      source.emit('error', err);
    } catch (e) {
      gotErr = e;
    }

    expect(gotErr).toBe(err);
  });

  it("should throw on error if error listeners have been removed", function() {
    var R = Stream.Readable;
    var W = Stream.Writable;

    var r = new R();
    var w = new W();
    var removed = false;
    var didTest = false;

    var test = this;
    waitsFor(function() { return didTest && removed; });

    r._read = function() {
      setTimeout(function() {
        expect(removed).toBeTruthy();
        var err = new Error('fail');
        try {
          w.emit('error', err);
          test.fail('Error not thrown');
        } catch(e) {
          expect(e).toBe(err);
        }
      });
      didTest = true;
    };

    w.on('error', myOnError);
    r.pipe(w);
    w.removeListener('error', myOnError);
    removed = true;

    function myOnError(er) {
      throw new Error('this should not happen');
    }
  });

  it("should throw on error if error listeners have been removed", function() {
    var R = Stream.Readable;
    var W = Stream.Writable;

    var r = new R();
    var w = new W();
    var removed = false;
    var didTest = false;
    var caught = false;

    waitsFor(function() { return didTest && removed && caught; });

    r._read = function() {
      setTimeout(function() {
        expect(removed).toBe(true);
        w.emit('error', new Error('fail'));
        didTest = true;
      });
    };

    w.on('error', myOnError);
    w._write = function() {};

    r.pipe(w);
    // Removing some OTHER random listener should not do anything
    w.removeListener('error', function() {});
    removed = true;

    function myOnError(er) {
      expect(caught).toBe(false);
      caught = true;
    }
  });
});
