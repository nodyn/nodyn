
function Async(object) {
  this._object = object;
  try {
    process._runAsyncQueue( this );
  } catch (err) {
    this._asyncFlags = this._asyncFlags | 1;
  }

  this._object.on( "makeCallbackByIndex", Async.prototype._makeCallbackByIndex.bind(this) );
}

Async.prototype._hasAsyncListener = function() {
  return this._asyncFlags & 1;
}

Async.prototype._makeCallbackByIndex = function(result) {
  var index = result.result;
  var callback = this[index];
  this._makeCallback( callback );
}

Async.prototype._makeCallback = function(callback) {
  if ( this._hasAsyncListener() ) {
    try {
      process._loadAsyncQueue( this );
    } catch (err) {
      return;
    }
  }

  var ret = undefined;

  try {
    ret = callback.apply( this );
  } catch (err) {
    return;
  }

  if ( this._hasAsyncListener() ) {
    try {
      process._unloadAsyncQueue( this );
    } catch(err) {
      return;
    }
  }

  if ( process._tickInfo.inTick ) {
    return ret;
  }
  if ( process._tickInfo[1] == 0 ) {
    process._tickInfo[0] = 0;
    return ret;
  }

  process._tickInfo.inTick = true;

  try {
    process._tickCallback();
  } catch(err) {
    process._tickInfo.lastThrew = true;
  } finally {
    process._tickInfo.inTick = false;
  }

  return ret;

}

module.exports.Async = Async;