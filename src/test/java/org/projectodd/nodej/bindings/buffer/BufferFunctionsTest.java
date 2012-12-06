package org.projectodd.nodej.bindings.buffer;

import static org.fest.assertions.Assertions.assertThat;

import org.dynjs.exception.ThrowException;
import org.dynjs.runtime.DynObject;
import org.dynjs.runtime.JSFunction;
import org.junit.Before;
import org.junit.Test;
import org.projectodd.nodej.NodejTestSupport;

public class BufferFunctionsTest extends NodejTestSupport {
    @Before
    public void setUp() {
        super.setUp();
        eval("var JavaBuffer = process.binding('buffer').SlowBuffer");
    }
    @Test
    public void testSlowBufferPrototype() {
        assertThat(eval("JavaBuffer")).isInstanceOf(BufferType.class);
        assertThat(eval("JavaBuffer.prototype")).isInstanceOf(DynObject.class);
        assertThat(eval("JavaBuffer.length")).isEqualTo(0L);
    }
    
    @Test
    public void testSlowBufferConstructor() {
        assertThat(eval("new JavaBuffer(12)")).isInstanceOf(Buffer.class);
    }
    
    @Test
    public void testSlowBufferLength() {
        assertThat(eval("JavaBuffer(4).length")).isEqualTo(4L);
    }
    
    @Test
    public void testMakeFastBuffer() {
        assertThat(eval("JavaBuffer(4).makeFastBuffer")).isInstanceOf(JSFunction.class);
    }
    
    @Test
    public void testBufferToString() {
        assertThat(eval("JavaBuffer(4).toString")).isInstanceOf(JSFunction.class);
    }
    
    @Test
    public void testBufferFill() {
        eval("var buffer = new JavaBuffer(4)");
        assertThat(eval("buffer.fill")).isInstanceOf(JSFunction.class);
        assertThat(eval("buffer.fill(72, 0, 4); buffer.toString()")).isEqualTo("HHHH");
    }
    
    @Test(expected = ThrowException.class)
    public void testBufferFillException() {
        eval("var buffer = new JavaBuffer(4)");
        eval("buffer.fill(1,0,5)");
    }

    @Test
    public void testByteLength() {
        assertThat(eval("JavaBuffer.byteLength")).isInstanceOf(JSFunction.class);
        assertThat(eval("JavaBuffer.byteLength('foo')")).isEqualTo(3);
    }
    
    @Test
    public void testByteLengthWithUnicode() {
        eval("str = '\u00bd + \u00bc = \u00be';");
        assertThat(eval("str.length == 9")).isEqualTo(true);
        assertThat(eval("JavaBuffer.byteLength(str, 'utf8')")).isEqualTo(12);
    }
    
    @Test(expected = ThrowException.class)
    public void testByteLengthFailsWithTypeError() {
        assertThat(eval("JavaBuffer.byteLength(8)"));
    }
}
