load("vertx_tests.js");

var qs = require('querystring');

function testEscape() {
  vassert.assertEquals("This+is+a+simple+%26+short+test.", qs.escape('This is a simple & short test.'));
  vassert.testComplete();
}

function testUnescape() {
  vassert.assertEquals('This is a simple & short test.', qs.unescape("This+is+a+simple+%26+short+test."));
  vassert.testComplete();
}

function testStringify() {
  vassert.assertEquals("foo=ba+r&baz=qux&baz=quux&corge=", qs.stringify({ foo: 'ba r', baz: ['qux', 'quux'], corge: '' }));
  vassert.testComplete();
}

function testStringifyCustomOptions() {
  vassert.assertEquals("foo:bar;baz:qux", qs.stringify({foo: 'bar', baz: 'qux'}, ';', ':'));
  vassert.testComplete();
}

function testParse() {
  var obj = qs.parse('foo=bar&baz=qux&baz=quux&corge');
  vassert.assertEquals("bar", obj.foo);
  vassert.assertEquals("qux", obj.baz[0]);
  vassert.assertEquals("quux", obj.baz[1]);
  vassert.assertEquals("", obj.corge);
  vassert.testComplete();
}

function testParseWithOptions() {
  var obj = qs.parse('foo:bar;baz:qux;baz:quux;corge', ';', ':');
  vassert.assertEquals("bar", obj.foo);
  vassert.assertEquals("qux", obj.baz[0]);
  vassert.assertEquals("quux", obj.baz[1]);
  vassert.assertEquals("", obj.corge);
  vassert.testComplete();
}

initTests(this);
