package org.projectodd.nodej;

import static org.fest.assertions.Assertions.assertThat;

import org.junit.Before;
import org.junit.Test;

public class QueryStringTest extends NodejTestSupport {
    
    @Before
    public void setUp() {
        super.setUp();
        eval("var qs = require('querystring')");
    }

    @Test
    public void testEscape() {
        assertThat(eval("qs.escape('This is a simple & short test.')")).isEqualTo("This+is+a+simple+%26+short+test.");
    }
    
    @Test
    public void testUnescape() {
        assertThat(eval("qs.unescape('This+is+a+simple+%26+short+test.')")).isEqualTo("This is a simple & short test.");
    }
    
    @Test
    public void testStringify() {
        assertThat(eval("qs.stringify({ foo: 'ba r', baz: ['qux', 'quux'], corge: '' })")).isEqualTo("foo=ba+r&baz=qux&baz=quux&corge=");
    }
    
    @Test
    public void testStringifyCustomOptions() {
        assertThat(eval("qs.stringify({foo: 'bar', baz: 'qux'}, ';', ':')")).isEqualTo("foo:bar;baz:qux");
    }
    
    @Test
    public void testParse() {
        eval("var obj = qs.parse('foo=bar&baz=qux&baz=quux&corge')");
        assertThat(eval("obj.foo")).isEqualTo("bar");
        assertThat(eval("obj.baz[0]")).isEqualTo("qux");
        assertThat(eval("obj.baz[1]")).isEqualTo("quux");
        assertThat(eval("obj.corge")).isEqualTo("");
    }
    
    @Test
    public void testParseWithOptions() {
        eval("var obj = qs.parse('foo:bar;baz:qux;baz:quux;corge', ';', ':')");
        assertThat(eval("obj.foo")).isEqualTo("bar");
        assertThat(eval("obj.baz[0]")).isEqualTo("qux");
        assertThat(eval("obj.baz[1]")).isEqualTo("quux");
        assertThat(eval("obj.corge")).isEqualTo("");
    }
}
