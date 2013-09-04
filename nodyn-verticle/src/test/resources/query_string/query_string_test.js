var vertxTest = require('vertx_tests');
var vassert   = vertxTest.vassert;

var qs = require('querystring');

var QueryStringTests = {
  testEscape: function() {
    vassert.assertEquals("This+is+a+simple+%26+short+test.", qs.escape('This is a simple & short test.'));
    vassert.testComplete();
  },

  testUnescape: function() {
    vassert.assertEquals('This is a simple & short test.', qs.unescape("This+is+a+simple+%26+short+test."));
    vassert.testComplete();
  },

  testStringify: function() {
    vassert.assertEquals("foo=ba+r&baz=qux&baz=quux&corge=", qs.stringify({ foo: 'ba r', baz: ['qux', 'quux'], corge: '' }));
    vassert.testComplete();
  },

  testStringifyCustomOptions: function() {
    vassert.assertEquals("foo:bar;baz:qux", qs.stringify({foo: 'bar', baz: 'qux'}, ';', ':'));
    vassert.testComplete();
  },

  testParse: function() {
    var obj = qs.parse('foo=bar&baz=qux&baz=quux&corge');
    vassert.assertEquals("bar", obj.foo);
    vassert.assertEquals("qux", obj.baz[0]);
    vassert.assertEquals("quux", obj.baz[1]);
    vassert.assertEquals("", obj.corge);
    vassert.testComplete();
  },

  testParseWithOptions: function() {
    var obj = qs.parse('foo:bar;baz:qux;baz:quux;corge', ';', ':');
    vassert.assertEquals("bar", obj.foo);
    vassert.assertEquals("qux", obj.baz[0]);
    vassert.assertEquals("quux", obj.baz[1]);
    vassert.assertEquals("", obj.corge);
    vassert.testComplete();
  }
}

vertxTest.startTests(QueryStringTests);
