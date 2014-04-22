var helper = require('specHelper');

describe("console", function() {

  // TODO: These mostly just test that the functions exist and are callable
  it('should log messages', function() {
    expect(typeof console.log).toBe('function');
    console.log('a log message');
  });

  it('should write info messages', function() {
    expect(typeof console.info).toBe('function');
    console.info('an info message');
  });

  it('should write warn messages', function() {
    expect(typeof console.warn).toBe('function');
    console.warn('a warning message');
  });

  it('should write error messages', function() {
    expect(typeof console.warn).toBe('function');
    console.error('an error message');
  });

  it('should write traces', function() {
    expect(typeof console.trace).toBe('function');
    // too noisy
    console.trace('test error label');
  });

  it('should write dir messages', function() {
    expect(typeof console.dir).toBe('function');
    console.dir(new Date());
  });

  it('should write timed messages', function() {
    expect(typeof console.info).toBe('function');
    console.time('LABEL');
    console.timeEnd('LABEL');
  });

  it('should throw on timeEnd() with a bad label', function() {
    expect(typeof console.info).toBe('function');
    try {
      console.timeEnd('BAD LABEL');
      this.fail("console.timeEnd() with an unknown label should throw");
    } catch(e) {
    }
  });

  it('should provide an assert that does not log when assert is true', function() {
    expect(typeof console.info).toBe('function');
    console.assert(true, "you should not see this");
  });

  it('should provide an assert that logs when assert is false', function() {
    try {
      console.assert(false, "EXPECTED");
      this.fail("console.assert(false) should throw");
    } catch(e) {
    }
  });
});
