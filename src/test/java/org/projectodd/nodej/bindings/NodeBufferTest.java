package org.projectodd.nodej.bindings;

import static org.fest.assertions.Assertions.assertThat;

import org.junit.Before;
import org.junit.Test;
import org.projectodd.nodej.NodejTestSupport;

public class NodeBufferTest extends NodejTestSupport {
    @Before
    public void setUp() {
        super.setUp();
        eval("var Buffer = require('buffer').Buffer;");
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
}
