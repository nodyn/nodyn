var helper = require('specHelper');
var path   = require('path');

var isWindows = process.platform === 'win32';
var fileSep   = java.lang.System.getProperty("file.separator");

describe('The path module', function() {
  it('should pass testNormalize', function() {
    if(isWindows) {
      expect(path.normalize('/foo/bar//baz/asdf/quux/..')).toBe("\\foo\\bar\\baz\\asdf"); 
    } else {
      expect(path.normalize('/foo/bar//baz/asdf/quux/..')).toBe("/foo/bar/baz/asdf"); 
    }
  });

  it('should pass testJoin', function() {
    if(isWindows) {
      expect(path.join('/foo', 'bar', 'baz/asdf', 'quux', '..')).toBe("\\foo\\bar\\baz\\asdf"); 
      expect( path.join('foo', {}, 'bar') ).toBe("foo\\bar");
    } else {
      expect( path.join('/foo', 'bar', 'baz/asdf', 'quux', '..') ).toBe("/foo/bar/baz/asdf");
      expect( path.join('foo', {}, 'bar') ).toBe("foo/bar");
    }
  });

  it('should pass testResolve', function() {
    if(isWindows) {
      expect( path.resolve('c:/foo/bar', './baz') ).toBe("c:\\foo\\bar\\baz");
    } else {
      expect( path.resolve('/foo/bar', './baz') ).toBe("/foo/bar/baz");
    }
  });

  it('should pass testRelative', function() {
    if(isWindows) {
      expect( path.relative('/data/orandea/test/aaa', '/data/orandea/impl/bbb') ).toBe("..\\..\\impl\\bbb");
    } else {
      expect( path.relative('/data/orandea/test/aaa', '/data/orandea/impl/bbb') ).toBe("../../impl/bbb");
    }
  });

  it('should pass testDirname', function() {
    expect( path.dirname('/foo/bar/baz/asdf/quux') ).toBe("/foo/bar/baz/asdf");
  });

  it('should pass testBasename', function() {
    expect( path.basename('/foo/bar/baz/asdf/quux.html') ).toBe("quux.html");
    expect( path.basename('/foo/bar/baz/asdf/quux.html', ".html") ).toBe("quux");
  });

  it('should pass testExtname', function() {
    expect( path.extname('index.html') ).toBe(".html");
  });

  it('should pass testPathSep', function() {
    expect( path.sep ).toBe(fileSep);
  });
});

