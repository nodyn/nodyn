var helper = require('specHelper');

var qs = require('querystring');

describe('The querystring module', function() {
  it('should pass testEscape', function() {
    expect(qs.escape('This is a simple & short test.')).toBe("This+is+a+simple+%26+short+test.");
  });

  it('should pass testUnescape', function() {
    expect(qs.unescape("This+is+a+simple+%26+short+test.")).toBe('This is a simple & short test.');
  });

  it('should pass testStringify', function() {
    expect(qs.stringify({ foo: 'ba r', baz: ['qux', 'quux'], corge: '' })).toBe("foo=ba+r&baz=qux&baz=quux&corge=");
  });

  it('should pass testStringifyCustomOptions', function() {
    expect(qs.stringify({foo: 'bar', baz: 'qux'}, ';', ':')).toBe("foo:bar;baz:qux");
  });

  it('should pass testParse', function() {
    var obj = qs.parse('foo=bar&baz=qux&baz=quux&corge');
    expect(obj.foo).toBe("bar");
    expect(obj.baz[0]).toBe("qux");
    expect(obj.baz[1]).toBe("quux");
    expect(obj.corge).toBe("");
  });

  it('should pass testParseWithOptions', function() {
    var obj = qs.parse('foo:bar;baz:qux;baz:quux;corge', ';', ':');
    expect(obj.foo).toBe("bar");
    expect(obj.baz[0]).toBe("qux");
    expect(obj.baz[1]).toBe("quux");
    expect(obj.corge).toBe("");
  });
});

