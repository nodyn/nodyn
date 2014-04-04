var specHelper = require('specHelper'),
    util = require('util');

describe('The util module', function() {
  it('should pass testFormat', function() {
    expect(util.format('1 2 3')).toBe('1 2 3');
  });

  it('should pass testDebug', function() {
    // only assures we don't fail - doesn't test the actual result
    util.debug('a debug message');
  });

  it('should pass testError', function() {
    // only assures we don't fail - doesn't test the actual result
    util.error('message to stderr', 'and', {});
  });

  it('should pass testPuts', function() {
    // only assures we don't fail - doesn't test the actual result
    util.puts('message to stdout', 'and', {});
  });

  it('should pass testPrint', function() {
    // only assures we don't fail - doesn't test the actual result
    util.print('message to stdout', 'and', {});
  });

  it('should pass testLog', function() {
    // only assures we don't fail - doesn't test the actual result
    util.log('message to log');
  });

  it('should pass testInspect', function() {
    // only assures we don't fail - doesn't test the actual result
    util.inspect(util, true, null);
  });

  it('should pass testIsArray', function() {
    expect(util.isArray([])).toBeTruthy();
    expect(util.isArray(new Array())).toBeTruthy();
    expect(util.isArray({})).toBeFalsy();
  });

  it('should pass testIsRegExp', function() {
    expect(util.isRegExp(/some regexp/)).toBeTruthy();
    expect(util.isRegExp(new RegExp('another regexp'))).toBeTruthy();
    expect(util.isRegExp({})).toBeFalsy();
  });

  it('should pass testIsError', function() {
    expect(util.isError(new Error())).toBeTruthy();
    expect(util.isError(new TypeError())).toBeTruthy();
    expect(util.isError({ name: 'Error', message: 'an error occurred' })).toBeFalsy();
  });
});


