package org.projectodd.nodej;

import static org.fest.assertions.Assertions.assertThat;

import org.dynjs.runtime.JSObject;
import org.junit.Before;
import org.junit.Test;

public class BufferTest extends NodejTestSupport {
    @Before
    public void setUp() {
        super.setUp();
        eval("var assert = require('assert')");
    }
    
    @Test
    public void testSafeCtor() {
        eval("var b = new Buffer(10)");
        eval("assert.strictEqual(10, b.length)");
        eval("b[0] = -1");
        assertThat(eval("b[0]")).isEqualTo(255);
        eval("assert.strictEqual(b[0], 255);");
    }

    @Test
    public void testRequireBuffer() {
        assertThat(eval("require('buffer')")).isInstanceOf(JSObject.class);
    }
    
    @Test
    public void testDefaultCtor() {
        assertThat(eval("new Buffer('buffstring').toString() == 'buffstring'")).isEqualTo(true);
    }
}
