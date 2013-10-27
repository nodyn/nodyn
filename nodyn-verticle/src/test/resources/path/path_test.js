var vertxTest = require('vertx_tests');
var vassert   = vertxTest.vassert;

var path = require('path');

var isWindows = process.platform === 'win32';

var fileSep = java.lang.System.getProperty("file.separator");

var PathTests = {
  testNormalize: function() {
	  if(isWindows) {
		  vassert.assertEquals("\\foo\\bar\\baz\\asdf", path.normalize('/foo/bar//baz/asdf/quux/..'));
	  } else {
		  vassert.assertEquals("/foo/bar/baz/asdf", path.normalize('/foo/bar//baz/asdf/quux/..'));
	  }
    vassert.testComplete();
  },

  testJoin: function() {
	  if(isWindows) {
		  vassert.assertEquals("\\foo\\bar\\baz\\asdf", path.join('/foo', 'bar', 'baz/asdf', 'quux', '..'));
		  vassert.assertEquals("foo\\bar", path.join('foo', {}, 'bar'));
	  } else {
		  vassert.assertEquals("/foo/bar/baz/asdf", path.join('/foo', 'bar', 'baz/asdf', 'quux', '..'));
		  vassert.assertEquals("foo/bar", path.join('foo', {}, 'bar'));
	  }
    vassert.testComplete();
  },

  testResolve: function() {
	  if(isWindows) {
		  vassert.assertEquals("c:\\foo\\bar\\baz", path.resolve('c:/foo/bar', './baz'));
	  } else {
		  vassert.assertEquals("/foo/bar/baz", path.resolve('/foo/bar', './baz'));
	  }
    vassert.testComplete();
  },

  testRelative: function() {
	  if(isWindows) {
		  vassert.assertEquals("..\\..\\impl\\bbb", path.relative('/data/orandea/test/aaa', '/data/orandea/impl/bbb'));
	  } else {
		  vassert.assertEquals("../../impl/bbb", path.relative('/data/orandea/test/aaa', '/data/orandea/impl/bbb'));
	  }
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
    vassert.assertEquals(fileSep, path.sep);
    vassert.testComplete();
  }
}

vertxTest.startTests(PathTests);
