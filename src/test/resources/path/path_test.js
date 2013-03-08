load('vertx.js');
load('vertx_tests.js');

var path = require('path');

function testNormalize() {
  vassert.assertEquals("/foo/bar/baz/asdf", path.normalize('/foo/bar//baz/asdf/quux/..'));
  vassert.testComplete();
}

function testJoin() {
  vassert.assertEquals("/foo/bar/baz/asdf", path.join('/foo', 'bar', 'baz/asdf', 'quux', '..'));
  vassert.assertEquals("foo/bar", path.join('foo', {}, 'bar'));
  vassert.testComplete();
}

function testResolve() {
  vassert.assertEquals("/foo/bar/baz", path.resolve('/foo/bar', './baz'));
  vassert.testComplete();
}

function testRelative() {
  vassert.assertEquals("../../impl/bbb", path.relative('/data/orandea/test/aaa', '/data/orandea/impl/bbb'));
  vassert.testComplete();
}

function testDirname() {
  vassert.assertEquals("/foo/bar/baz/asdf", path.dirname('/foo/bar/baz/asdf/quux'));
  vassert.testComplete();
}

function testBasename() {
  vassert.assertEquals("quux.html", path.basename('/foo/bar/baz/asdf/quux.html'));
  vassert.assertEquals("quux", path.basename('/foo/bar/baz/asdf/quux.html', ".html"));
  vassert.testComplete();
}

function testExtname() {
  vassert.assertEquals(".html", path.extname('index.html'));
  vassert.testComplete();
}

function testPathSep() {
  vassert.assertEquals(java.lang.System.getProperty("file.separator"), path.sep);
  vassert.testComplete();
}

initTests(this);

