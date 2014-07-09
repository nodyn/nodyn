

module.exports.runInThisContext = function(code,filename) {
  var script  = createScript(code,filename);
  return script.runInThisContext();
};

module.exports.runInNewContext = function() {
  var code = arguments[0];
  var sandbox = {};
  var filename = "<script>";

  if ( arguments.length == 2 ) {
    if ( arguments[1] instanceof String ) {
      filename = arguments[1];
    } else {
      sandbox = arguments[1];
    }
  } else if ( arguments.length == 3) {
    sandbox  = arguments[1];
    filename = arguments[2];
  }
  var script  = createScript(code,filename);
  return script.runInNewContext( sandbox );
};

module.exports.runInContext = function(code,context,filename) {
  if ( ! filename ) {
    filename = '<script>';
  }
  var script = createScript(code,filename);
  return script.runInContext
};

function createContext(sandbox) {
  var runtime = new org.dynjs.runtime.DynJS();
  if ( sandbox ) {
    var g = runtime.globalObject;
    for ( k in sandbox ) {
      g[k] = sandbox[k];
    }
  }
  return runtime;
};
module.exports.createContext = createContext;

function createScript(code,filename) {
  return new Script(code,filename);
};
module.exports.createScript = createScript;

function Script(code,filename) {
  this._code = code;
  this._filename = filename;
}

Script.prototype.runInThisContext = function() {
  return this._runInContext();
};

Script.prototype.runInNewContext = function(sandbox) {
  var context = createContext(sandbox);
  return this._runInContext(context);
};

Script.prototype._runInContext = function(context) {
  if ( ! context ) {
    context = dynjs.runtime;
  }
  return context.newRunner().withSource( this._code ).withFileName( this._filename ).execute();
}


module.exports.Script = Script;

  


