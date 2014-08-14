/*
 * Copyright 2014 Red Hat, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

function Async(object) {
  this._object = object;
  try {
    process._runAsyncQueue( this );
  } catch (err) {
    this._asyncFlags = this._asyncFlags | 1;
  }

  this._object.on( "makeCallbackByIndex", _makeCallbackByIndex.bind(this) );
}

function _hasAsyncListener() {
  return this._asyncFlags & 1;
}

function _makeCallbackByIndex(result) {
  var index = result.result;
  var callback = this[index];
  _makeCallback.bind(this)( callback );
}

function _makeCallback(callback) {
  if ( _hasAsyncListener.bind(this)() ) {
    try {
      process._loadAsyncQueue( this );
    } catch (err) {
      return;
    }
  }

  var ret;

  try {
    ret = callback.apply( this );
  } catch (err) {
    return;
  }

  if ( _hasAsyncListener.bind(this)() ) {
    try {
      process._unloadAsyncQueue( this );
    } catch(err) {
      return;
    }
  }

  if ( process._tickInfo.inTick ) {
    return ret;
  }
  if ( process._tickInfo[1] === 0 ) {
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
