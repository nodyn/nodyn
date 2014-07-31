
var util = require('util');
var Handle = require('nodyn/bindings/handle_wrap').Handle;

function Timer() {
  this._timer = new io.nodyn.timer.TimerWrap( process._process );
  Handle.call( this, this._timer );
}

util.inherits( Timer, Handle );

Timer.prototype.start = function(msec, repeat) {
  this._timer.start(msec, repeat);
}

Timer.prototype.stop = function() {
  this._timer.stop();
}

Timer.now = io.nodyn.timer.TimerWrap.now;

module.exports.Timer = Timer;