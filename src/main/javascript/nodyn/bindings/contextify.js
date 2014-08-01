
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
  var runtime = new io.nodyn.Nodyn(__nodyn);
  var g = runtime.globalObject;

  for ( var k in obj ) {
    g[k] = obj[k];
  }

  return g;
}

module.exports.ContextifyScript = ContextifyScript;
module.exports.isContext        = isContext;
module.exports.makeContext      = makeContext;
