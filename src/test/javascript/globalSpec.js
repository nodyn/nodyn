var helper = require('specHelper');

describe("Nodyn globals", function() {
  it('should pass testGlobal', function() {
    expect(typeof global).toBe('object');
  });

  it('should pass testProcess', function() {
    expect(typeof global.process).toBe('object');
    expect(typeof process).toBe('object');
  });

  it('should pass testConsole', function() {
    expect(typeof global.console).toBe('object');
    expect(typeof console).toBe('object');
  });

  it('should pass testRequire', function() {
    expect(typeof global.require).toBe('function');
    expect(typeof require).toBe('function');
    // TODO
    //expect(typeof require.resolve).toBe('function');
    //expect(typeof require.cache).toBe('object');
    //expect(typeof require.extensions).toBe('object');
  });

  it('should pass test__filename', function() {
    expect(typeof __filename).toBe('string');
    expect(__filename).toMatch(/.*node.js/);
  });

  it('should pass test__dirname', function() {
    expect(typeof __dirname).toBe('string');
  });
});

