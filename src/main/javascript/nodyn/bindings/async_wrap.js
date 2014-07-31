
function Async(object) {
  this._object = object;
  this._object.on( "makeCallbackByIndex", Async.prototype._makeCallbackByIndex.bind(this) );
}

Async.prototype._makeCallbackByIndex = function(result) {
  var index = result.result;
  var callback = this[index];
  this._makeCallback( callback );
}

Async.prototype._makeCallback = function(callback) {
  process._loadAsyncQueue.apply(this, [ __nodyn.globalObject ] );
  callback.apply( this );
  process._unloadAsyncQueue.apply(this, [ __nodyn.globalObject ] );

  if ( process._tickInfo[1] == 0 ) {
    process._tickInfo[0] = 0;
    return;
  }
  process._tickCallback();
}

module.exports.Async = Async;