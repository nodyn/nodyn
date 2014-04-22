var helper = require('specHelper');
var nodyn  = NativeRequire.require('nodyn');

var MockEmitter = function() {};
nodyn.makeEventEmitter(MockEmitter);

describe('events module', function() {
  var emitter = new MockEmitter();

  beforeEach(function() {
    emitter.removeAllListeners('ding');
  });

  it('should pass testOnEvent', function() {
    var x = 0;
    var func = function() { x = x+1; };
    emitter.on('ding', func);
    emitter.emit('ding');
    expect(x).toBe(1);
    emitter.emit('ding');
    expect(x).toBe(2);
  });

  it('should pass testOnce', function() {
    var x = 0;
    var func = function() { x = x+1; };
    emitter.once('ding', func);
    emitter.emit('ding');
    expect(x).toBe(1);
    emitter.emit('ding');
    expect(x).toBe(1);
  });

  it('should pass testRemoveListener', function() {
    var x = 0;
    var func = function() { x = x+1; };
    emitter.on('ding', func);
    expect(emitter.listeners('ding').length).toBe(1);
    emitter.removeListener('ding', func);
    expect(emitter.listeners('ding').length).toBe(0);
  });

  it('should pass testRemoveAllListeners', function() {
    var x = 0;
    var func = function() { x = x+1; };
    emitter.on('ding', func);
    expect(emitter.listeners('ding').length).toBe(1);
    emitter.removeAllListeners('ding', func);
    expect(emitter.listeners('ding').length).toBe(0);
  });
});
