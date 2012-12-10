package org.projectodd.nodej.bindings;

import org.junit.Before;
import org.junit.Ignore;
import org.junit.Test;
import org.projectodd.nodej.NodejTestSupport;
import static org.fest.assertions.Assertions.*;

public class NodeBufferTest extends NodejTestSupport {
    @Before
    public void setUp() {
        super.setUp();
        eval("var Buffer = require('buffer').Buffer;");
        eval("var assert = require('assert')");
    }
    
    @Test
    @Ignore
    public void testSafeCtor() {
        eval("var b = Buffer(1024)");
        eval("assert.strictEqual(1024, b.length)");
        eval("b[0] = -1");
        eval("assert.equal(b[0], -1);");
        assertThat(eval("b[1];")).isEqualTo(0L);
    }
}
