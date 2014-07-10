module.exports = new org.jasmine.Executor({

  execute: function(specs, notifier) {
    this.specs = specs;
    this.notifier = notifier;
  },

  run: function() {
    var toRunnable = function(fn){
      return new java.lang.Runnable({
        run: function(){
          try {
            fn();
          } catch (e) {
            System.out.println(e);
          }
        }
      });
    };
    var scheduler = java.util.concurrent.Executors.newSingleThreadScheduledExecutor();

    load("jasmine-1.3.1/jasmine.js");
    var notifierReporter = require("jasmine-jvm/reporter").reporter;
    var jasmineEnv = jasmine.getEnv();

    jasmineEnv.addReporter(notifierReporter(this.notifier));

    var done = com.google.common.util.concurrent.SettableFuture.create();
    jasmineEnv.addReporter({
      reportRunnerResults: function(runner){
        done.set(true);
      }
    });

    for(var i = 0; i < this.specs.size(); i++){
      require(this.specs.get(i));
    }

    setTimeout(function(){
      jasmineEnv.execute();
    }, 0);

    done.get();
    scheduler.shutdown();
  }
});
