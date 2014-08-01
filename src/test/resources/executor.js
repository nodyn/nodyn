exports.executor = new org.jasmine.Executor({
    execute: function(specs, notifier){
        var toRunnable = function(fn){
          return new java.lang.Runnable({
            run: function(){
              try {
                fn();
              } catch (e) {
                e.printStackTrace();
                System.out.println(e);
              }
            }
          });
        }
        var futures = [];
        var scheduler = java.util.concurrent.Executors.newSingleThreadScheduledExecutor();

        global.setTimeout = function(fn, delay){
          var id = futures.length
          futures[id] = scheduler.schedule(toRunnable(fn), delay, java.util.concurrent.TimeUnit.SECONDS)
          return id;
        }

        global.setInterval = function(fn, delay){
          var id = futures.length;
          futures[id] = scheduler.schedule(toRunnable(fn), delay, delay, java.util.concurrent.TimeUnit.SECONDS)
          return id;
        }

        global.clearTimeout = function(id){
            futures[id].cancel();
        }

        global.clearInterval = global.clearTimeout

        var jasmineLib = require("jasmine-1.3.1/jasmine");
        for(var key in jasmineLib){
          global[key] = jasmineLib[key];
        }

        var notifierReporter = require("jasmine-jvm/reporter").reporter;

        for(var i = 0; i < specs.size(); i++){
            require(specs.get(i));
        };

        var jasmineEnv = jasmine.getEnv();

        jasmineEnv.addReporter(notifierReporter(notifier));

        var done = com.google.common.util.concurrent.SettableFuture.create();
        jasmineEnv.addReporter({
            reportRunnerResults: function(runner){
                done.set(true);
            }
        });


        setTimeout(function(){
            jasmineEnv.execute();
        }, 0);


        done.get();
        scheduler.shutdown();
    }
});
