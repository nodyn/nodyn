package org.projectodd.nodej.bindings;

import static org.fest.assertions.Assertions.assertThat;

import java.net.UnknownHostException;

import org.dynjs.runtime.DynObject;
import org.junit.Ignore;
import org.junit.Test;
import org.projectodd.nodej.NodejTestSupport;
import org.projectodd.nodej.bindings.buffer.SlowBuffer;

public class BufferBindingsTest extends NodejTestSupport {
    @Test
    @Ignore
    public void testSlowBuffer() throws UnknownHostException {
        assertThat(eval("process.binding('buffer').SlowBuffer")).isInstanceOf(SlowBuffer.class);
        assertThat(eval("process.binding('buffer').SlowBuffer.prototype")).isInstanceOf(DynObject.class);
    }
}
