package org.projectodd.nodej.bindings.buffer;

import static org.fest.assertions.Assertions.assertThat;

import java.net.UnknownHostException;

import org.dynjs.runtime.JSFunction;
import org.junit.Test;
import org.projectodd.nodej.NodejTestSupport;

public class BufferFunctionsTest extends NodejTestSupport {
    @Test
    public void testByteLength() throws UnknownHostException {
        assertThat(eval("process.binding('buffer').SlowBuffer.byteLength")).isInstanceOf(JSFunction.class);
    }
}
