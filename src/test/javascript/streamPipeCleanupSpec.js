var stream = require('stream');
var util = require('util');

function Writable() {
  this.writable = true;
  this.endCalls = 0;
  stream.Stream.call(this);
}
util.inherits(Writable, stream.Stream);
Writable.prototype.end = function() {
  this.endCalls++;
};

Writable.prototype.destroy = function() {
  this.endCalls++;
};

function Readable() {
  this.readable = true;
  stream.Stream.call(this);
}
util.inherits(Readable, stream.Stream);

function Duplex() {
  this.readable = true;
  Writable.call(this);
}
util.inherits(Duplex, Writable);

describe("Stream pipe cleanup", function() {
  it("should work", function() {
    var i = 0;
    var limit = 100;

    var w = new Writable();

    var r;

    for (i = 0; i < limit; i++) {
      r = new Readable();
      r.pipe(w);
      r.emit('end');
    }
    expect(r.listeners('end').length).toBe(0);
    expect(w.endCalls).toBe(limit);

    w.endCalls = 0;

    for (i = 0; i < limit; i++) {
      r = new Readable();
      r.pipe(w);
      r.emit('close');
    }
    expect(r.listeners('close').length).toBe(0);
    expect(w.endCalls).toBe(limit);

    w.endCalls = 0;

    r = new Readable();

    for (i = 0; i < limit; i++) {
      w = new Writable();
      r.pipe(w);
      w.emit('close');
    }
    expect(w.listeners('close').length).toBe(0);

    r = new Readable();
    w = new Writable();
    var d = new Duplex();
    r.pipe(d); // pipeline A
    d.pipe(w); // pipeline B
    expect(r.listeners('end').length).toBe(2);   // A.onend, A.cleanup
    expect(r.listeners('close').length).toBe(2); // A.onclose, A.cleanup
    expect(d.listeners('end').length).toBe(2);   // B.onend, B.cleanup
    expect(d.listeners('close').length).toBe(3); // A.cleanup, B.onclose, B.cleanup
    expect(w.listeners('end').length).toBe(0);
    expect(w.listeners('close').length).toBe(1); // B.cleanup

    r.emit('end');
    expect(d.endCalls).toBe(1);
    expect(w.endCalls).toBe(0);
    expect(r.listeners('end').length).toBe(0);
    expect(r.listeners('close').length).toBe(0);
    expect(d.listeners('end').length).toBe(2);   // B.onend, B.cleanup
    expect(d.listeners('close').length).toBe(2); // B.onclose, B.cleanup
    expect(w.listeners('end').length).toBe(0);
    expect(w.listeners('close').length).toBe(1); // B.cleanup

    d.emit('end');
    expect(d.endCalls).toBe(1);
    expect(w.endCalls).toBe(1);
    expect(r.listeners('end').length).toBe(0);
    expect(r.listeners('close').length).toBe(0);
    expect(d.listeners('end').length).toBe(0);
    expect(d.listeners('close').length).toBe(0);
    expect(w.listeners('end').length).toBe(0);
    expect(w.listeners('close').length).toBe(0);
  });
});
