var vertxTest = require('vertx_tests');
var vassert   = vertxTest.vassert;

var path = require('path');

var PathTests = {
  testNormalize: function() {
    vassert.assertEquals("/foo/bar/baz/asdf", path.normalize('/foo/bar//baz/asdf/quux/..'));
    vassert.testComplete();
  },

  testJoin: function() {
    vassert.assertEquals("/foo/bar/baz/asdf", path.join('/foo', 'bar', 'baz/asdf', 'quux', '..'));
    vassert.assertEquals("foo/bar", path.join('foo', {}, 'bar'));
    vassert.testComplete();
  },

  testResolve: function() {
    vassert.assertEquals("/foo/bar/baz", path.resolve('/foo/bar', './baz'));
    vassert.testComplete();
  },

  testRelative: function() {
    vassert.assertEquals("../../impl/bbb", path.relative('/data/orandea/test/aaa', '/data/orandea/impl/bbb'));
    vassert.testComplete();
  },

  testDirname: function() {
    vassert.assertEquals("/foo/bar/baz/asdf", path.dirname('/foo/bar/baz/asdf/quux'));
    vassert.testComplete();
  },

  testBasename: function() {
    vassert.assertEquals("quux.html", path.basename('/foo/bar/baz/asdf/quux.html'));
    vassert.assertEquals("quux", path.basename('/foo/bar/baz/asdf/quux.html', ".html"));
    vassert.testComplete();
  },

  testExtname: function() {
    vassert.assertEquals(".html", path.extname('index.html'));
    vassert.testComplete();
  },

  testPathSep: function() {
    vassert.assertEquals(java.lang.System.getProperty("file.separator"), path.sep);
    vassert.testComplete();
  }
}

vertxTest.startTests(PathTests);
