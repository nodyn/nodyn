var vertxTest = require('vertx_tests');
var vassert   = vertxTest.vassert;

EventEmitter = require('events').EventEmitter;

var EventsTests = {

  testEventEmitterIsNotNull: function() {
    vassert.assertNotNull(EventEmitter);
    vassert.testComplete();
  },

  testOnEvent: function() {
    var x = 0;
    var func = function() { x = x+1 }
    EventEmitter.prototype.on('ding', func);
    EventEmitter.prototype.emit('ding');
    vassert.assertEquals(1, x);
    EventEmitter.prototype.emit('ding');
    vassert.assertEquals(2, x);
    vassert.testComplete();
  },

  testOnce: function() {
    var x = 0;
    var func = function() { x = x+1 }
    EventEmitter.prototype.once('ding', func);
    EventEmitter.prototype.emit('ding');
    vassert.assertEquals(1, x);
    EventEmitter.prototype.emit('ding');
    vassert.assertEquals(1, x);
    vassert.testComplete();
  },

  testRemoveListener: function() {
    var x = 0;
    var func = function() { x = x+1 }
    EventEmitter.prototype.on('ding', func);
    vassert.assertEquals(1, EventEmitter.prototype.listeners('ding').length);
    EventEmitter.prototype.removeListener('ding', func);
    vassert.assertEquals(0, EventEmitter.prototype.listeners('ding').length);
    vassert.testComplete();
  },

  testRemoveAllListeners: function() {
    var x = 0;
    var func = function() { x = x+1 }
    EventEmitter.prototype.on('ding', func);
    vassert.assertEquals(1, EventEmitter.prototype.listeners('ding').length);
    EventEmitter.prototype.removeAllListeners('ding', func);
    vassert.assertEquals(0, EventEmitter.prototype.listeners('ding').length);
    vassert.testComplete();
  }
}
vertxTest.startTests(EventsTests);
