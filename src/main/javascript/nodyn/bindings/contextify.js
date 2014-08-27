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

"use strict";

function ContextifyScript(script,options) {
  options = options || {};

  var filename = options.filename || '<eval>';
  var displayErrors = options.displayErrors || false;

  this._script = new io.nodyn.contextify.ContextifyScriptWrap(__nodyn, script, filename, displayErrors);
}

ContextifyScript.prototype.runInThisContext = function() {
  return this.runInContext( __nodyn.globalObject );
}

ContextifyScript.prototype.runInContext = function(context) {
  return this._script.runInContext( context );
}

function isContext(obj) {
  return (obj instanceof org.dynjs.runtime.GlobalObject );
}

function makeContext(obj) {
  var runtime = new org.dynjs.runtime.DynJS(__nodyn.config);
  var g = runtime.globalObject;

  for ( var k in obj ) {
    g[k] = obj[k];
  }

  return g;
}

module.exports.ContextifyScript = ContextifyScript;
module.exports.isContext        = isContext;
module.exports.makeContext      = makeContext;
