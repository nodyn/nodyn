var helper = require('specHelper');
var EventEmitter = require('events').EventEmitter;

describe('events module', function() {

  beforeEach(function() {
    EventEmitter.prototype.removeAllListeners('ding');
  });

  it('should pass testOnEvent', function() {
    var x = 0;
    var func = function() { x = x+1; };
    EventEmitter.prototype.on('ding', func);
    EventEmitter.prototype.emit('ding');
    expect(x).toBe(1);
    EventEmitter.prototype.emit('ding');
    expect(x).toBe(2);
  });

  it('should pass testOnce', function() {
    var x = 0;
    var func = function() { x = x+1; };
    EventEmitter.prototype.once('ding', func);
    EventEmitter.prototype.emit('ding');
    expect(x).toBe(1);
    EventEmitter.prototype.emit('ding');
    expect(x).toBe(1);
  });

  it('should pass testRemoveListener', function() {
    var x = 0;
    var func = function() { x = x+1; };
    EventEmitter.prototype.on('ding', func);
    expect(EventEmitter.prototype.listeners('ding').length).toBe(1);
    EventEmitter.prototype.removeListener('ding', func);
    expect(EventEmitter.prototype.listeners('ding').length).toBe(0);
  });

  it('should pass testRemoveAllListeners', function() {
    var x = 0;
    var func = function() { x = x+1; };
    EventEmitter.prototype.on('ding', func);
    expect(EventEmitter.prototype.listeners('ding').length).toBe(1);
    EventEmitter.prototype.removeAllListeners('ding', func);
    expect(EventEmitter.prototype.listeners('ding').length).toBe(0);
  });
});
