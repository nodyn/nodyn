package org.projectodd.nodej.bindings;

import static org.fest.assertions.Assertions.assertThat;

import java.net.UnknownHostException;

import org.dynjs.runtime.DynObject;
import org.dynjs.runtime.builtins.types.AbstractBuiltinType;
import org.junit.Test;
import org.projectodd.nodej.NodejTestSupport;

public class BufferBindingsTest extends NodejTestSupport {
    @Test
    public void testSlowBuffer() throws UnknownHostException {
        assertThat(eval("process.binding('buffer').SlowBuffer")).isInstanceOf(AbstractBuiltinType.class);
        assertThat(eval("process.binding('buffer').SlowBuffer.prototype")).isInstanceOf(DynObject.class);
    }
}
