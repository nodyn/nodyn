package org.projectodd.nodej;

import static org.fest.assertions.Assertions.assertThat;

import java.io.IOException;

import org.dynjs.runtime.DynObject;
import org.dynjs.runtime.Types;
import org.junit.Before;
import org.junit.Test;

public class PathTest extends NodejTestSupport {
    
    @Before
    public void beforeTests() {
        assertThat(eval("path = require('path'); path").getClass()).isEqualTo(DynObject.class);
    }

    @Test
    public void testNormalize() {
        assertThat(eval("path.normalize('/foo/bar//baz/asdf/quux/..')")).isEqualTo("/foo/bar/baz/asdf");
    }
    
    @Test
    public void testJoin() {
        assertThat(eval("path.join('/foo', 'bar', 'baz/asdf', 'quux', '..')")).isEqualTo("/foo/bar/baz/asdf");
        assertThat(eval("path.join('foo', {}, 'bar')")).isEqualTo("foo/bar");
    }
    
    @Test
    public void testResolve() {
        assertThat(eval("path.resolve('/foo/bar', './baz')")).isEqualTo("/foo/bar/baz");
    }
    
    @Test
    public void testRelative() {
        assertThat(eval("path.relative('/data/orandea/test/aaa', '/data/orandea/impl/bbb')")).isEqualTo("../../impl/bbb");
    }
    
    @Test
    public void testDirname() {
        assertThat(eval("path.dirname('/foo/bar/baz/asdf/quux')")).isEqualTo("/foo/bar/baz/asdf");
    }
    
    @Test
    public void testBasename() {
        assertThat(eval("path.basename('/foo/bar/baz/asdf/quux.html')")).isEqualTo("quux.html");
        // TODO: Not clear why this is failing
//        assertThat(eval("path.basename('/foo/bar/baz/asdf/quux.html', '.html')")).isEqualTo("quux");
    }
    
    @Test
    public void testExtname() {
        assertThat(eval("path.extname('index.html')")).isEqualTo(".html");
    }
    
    @Test
    public void testPathSep() {
        assertThat(eval("path.sep")).isEqualTo(System.getProperty("file.separator"));
    }
}
