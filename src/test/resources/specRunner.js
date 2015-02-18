var scanner = require('./scanner');

module.exports = {
  run: function(pattern) {

    // load jasmine and a terminal reporter into global
    load("./target/test-classes/jasmine-1.3.1/jasmine.js");
    load('./target/test-classes/terminalReporter.js');
    color = !process.env.JASMINE_NOCOLOR;

    // load the specs
    var jasmineEnv = jasmine.getEnv(),
        specs      = scanner.findSpecs(pattern),
        reporter   = new jasmine.TerminalReporter({verbosity:3,color:color}); 

    jasmineEnv.addReporter(reporter);

    for(var i = 0; i < specs.length; i++) {
      require(specs[i]);
    }
    process.nextTick(jasmineEnv.execute.bind(jasmineEnv));
  }
};


