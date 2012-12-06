package org.projectodd.nodej.bindings.buffer;

import static org.fest.assertions.Assertions.assertThat;

import org.junit.Before;
import org.junit.Test;
import org.projectodd.nodej.NodejTestSupport;

public class BufferWriteTest extends NodejTestSupport {
    @Before
    public void setUp() {
        super.setUp();
        eval("var JavaBuffer = process.binding('buffer').SlowBuffer");
    }

    @Test
    public void testBufferUtf8Write() {
        String string = "Now is the winter of our discontent made glorious summer";
        eval("var buff = new JavaBuffer(100)");
        assertThat(eval("buff.utf8Write('"+string+"', 0)")).isEqualTo((long)string.length());
        assertThat(eval("buff.toString()")).isEqualTo(string);
    }
}
