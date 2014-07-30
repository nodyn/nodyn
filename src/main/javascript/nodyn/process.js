(function(javaProcess){

  function Process(process) {
    this._process = process;
    this.moduleLoadList = [];

    Object.defineProperty( this, "EVENT_LOOP", {
      get: function() {
        return this._process.eventLoop;
      }
    });

    this.context = this._process.vertx;

    this.binding = function(name) {
      return this._process.binding(name);
    };

    this._setupAsyncListener = function(asyncFlags, runAsyncQueue, loadAsyncQueue, unloadAsyncQueue) {
    };

    this._setupNextTick = function(tickInfo, tickCallback) {
    };

    this._setupDomainUse = function(domain, domainFlag) {
    };

    this.cwd = function() {
      return System.getProperty("user.dir");
    }

    this.execPath = this._process.execPath;

    // ARGV
    this.argv = [];
    this.argv.push( System.getProperty( "nodyn.binary" ) );
    for ( i = 0 ; i < this._process.nodyn.config.argv.length ; ++i ) {
      this.argv.push( this._process.nodyn.config.argv[i] );
    }

    this.env = {
      HOME: System.getProperty("user.home"),
    };

    this.reallyExit = function(code) {
      System.exit( code );
    };
  }


  return new Process(javaProcess);
})




