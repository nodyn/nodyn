

module.exports.runInThisContext = function(code,options) {
  var script  = createScript(code,options);
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
  var script  = createScript(code, {filename: filename} );
  return script.runInNewContext( sandbox );
};

module.exports.runInContext = function(code,context,options) {
  var script = createScript(code,options);
  return script.runInContext(context,options);
};

function createContext(sandbox) {
  var runtime = new io.nodyn.Nodyn(__nodyn);
  var g = runtime.globalObject;

  if ( sandbox ) {
    for ( k in sandbox ) {
      g[k] = sandbox[k];
    }
  }

  return g;
};

module.exports.createContext = createContext;

function createScript(code,options) {
  return new Script(code,options);
};
module.exports.createScript = createScript;

function Script(code,options) {
  this._code = code;
  this._filename = ( options && options.filename ) || '<script>';
}

Script.prototype.runInThisContext = function() {
  return this.runInContext( global );
};

Script.prototype.runInNewContext = function(sandbox) {
  var context = createContext(sandbox);
  return this.runInContext(context);
};

Script.prototype.runInContext = function(context,options) {
  var runner = context.__nodyn.newRunner().withSource( this._code ).withFileName( this._filename );
  return context.__nodyn.start( runner );
}


module.exports.Script = Script;

  


