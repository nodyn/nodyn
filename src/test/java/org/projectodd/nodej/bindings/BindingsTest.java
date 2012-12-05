package org.projectodd.nodej.bindings;

import static org.fest.assertions.Assertions.assertThat;

import org.junit.Test;
import org.projectodd.nodej.NodejTestSupport;

public class BindingsTest extends NodejTestSupport {
    @Test
    public void testBufferBindings() {
        assertThat(eval("process.binding('buffer')")).isInstanceOf(Buffer.class);
    }
    
    @Test
    public void testOsBindings() {
        assertThat(eval("process.binding('os')")).isInstanceOf(Os.class);
    }
}
