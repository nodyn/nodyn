module.exports = new org.jasmine.Executor({

  execute: function(specs, notifier) {
    this.specs = specs;
    this.notifier = notifier;
  },

  run: function() {
    load("jasmine-1.3.1/jasmine.js");
    var notifierReporter = require("./reporter.js").reporter;
    var jasmineEnv = jasmine.getEnv();

    jasmineEnv.addReporter(notifierReporter(this.notifier));

    var done = com.google.common.util.concurrent.SettableFuture.create();
    jasmineEnv.addReporter({
      reportRunnerResults: function(runner) {
        done.set(true);
      }
    });

    for(var i = 0; i < this.specs.size(); i++) {
      require(this.specs.get(i));
    }

    var start = java.lang.System.currentTimeMillis();
    process.nextTick(jasmineEnv.execute.bind(jasmineEnv));
  }
});
