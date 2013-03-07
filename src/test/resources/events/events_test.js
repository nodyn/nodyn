load("vertx.js");
load("vertx_tests.js");
EventEmitter = require('events').EventEmitter;

function testEventEmitterIsNotNull() {
  vassert.assertNotNull(EventEmitter);
  vassert.testComplete();
}

function testOnEvent() {
  var x = 0;
  var func = function() { x = x+1 }
  EventEmitter.prototype.on('ding', func);
  EventEmitter.prototype.emit('ding');
  vassert.assertEquals(1, x);
  EventEmitter.prototype.emit('ding');
  vassert.assertEquals(2, x);
  vassert.testComplete();
}

function testOnce() {
  var x = 0;
  var func = function() { x = x+1 }
  EventEmitter.prototype.once('ding', func);
  EventEmitter.prototype.emit('ding');
  vassert.assertEquals(1, x);
  EventEmitter.prototype.emit('ding');
  vassert.assertEquals(1, x);
  vassert.testComplete();
}

function testRemoveListener() {
  var x = 0;
  var func = function() { x = x+1 }
  EventEmitter.prototype.on('ding', func);
  vassert.assertEquals(1, EventEmitter.prototype.listeners('ding').length);
  EventEmitter.prototype.removeListener('ding', func);
  vassert.assertEquals(0, EventEmitter.prototype.listeners('ding').length);
  vassert.testComplete();
}

function testRemoveAllListeners() {
  var x = 0;
  var func = function() { x = x+1 }
  EventEmitter.prototype.on('ding', func);
  vassert.assertEquals(1, EventEmitter.prototype.listeners('ding').length);
  EventEmitter.prototype.removeAllListeners('ding', func);
  vassert.assertEquals(0, EventEmitter.prototype.listeners('ding').length);
  vassert.testComplete();
}

initTests(this);
