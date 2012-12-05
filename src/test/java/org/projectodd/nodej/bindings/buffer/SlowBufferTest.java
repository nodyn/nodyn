package org.projectodd.nodej.bindings.buffer;

import static org.fest.assertions.Assertions.assertThat;

import org.dynjs.exception.ThrowException;
import org.dynjs.runtime.DynObject;
import org.dynjs.runtime.JSFunction;
import org.junit.Test;
import org.projectodd.nodej.NodejTestSupport;

public class SlowBufferTest extends NodejTestSupport {
    @Test
    public void testSlowBuffer() {
        assertThat(eval("process.binding('buffer').SlowBuffer")).isInstanceOf(SlowBuffer.class);
        assertThat(eval("process.binding('buffer').SlowBuffer.prototype")).isInstanceOf(DynObject.class);
    }

    @Test
    public void testByteLength() {
        assertThat(eval("process.binding('buffer').SlowBuffer.byteLength")).isInstanceOf(JSFunction.class);
        assertThat(eval("process.binding('buffer').SlowBuffer.byteLength('foo')")).isEqualTo(3);
    }
    
    @Test
    public void testByteLengthWithUnicode() {
        eval("str = '\u00bd + \u00bc = \u00be';");
        assertThat(eval("str.length == 9")).isEqualTo(true);
        assertThat(eval("process.binding('buffer').SlowBuffer.byteLength(str, 'utf8')")).isEqualTo(12);
    }
    
    @Test(expected = ThrowException.class)
    public void testByteLengthFailsWithTypeError() {
        assertThat(eval("process.binding('buffer').SlowBuffer.byteLength(8)"));
    }
}
