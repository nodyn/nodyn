package org.projectodd.nodej.bindings.buffer;

import static org.fest.assertions.Assertions.assertThat;

import java.io.UnsupportedEncodingException;

import org.junit.Before;
import org.junit.Test;
import org.projectodd.nodej.NodejTestSupport;

public class BufferWriteTest extends NodejTestSupport {
    @Before
    public void setUp() {
        super.setUp();
        eval("var assert = require('assert')");
        eval("var JavaBuffer = process.binding('buffer').SlowBuffer");
    }

    @Test
    public void testBufferUtf8Write() throws UnsupportedEncodingException {
        String string = "Now is the winter of our discontent made glorious summer";
        eval("var buff = new JavaBuffer(100)");
        assertThat(eval("buff.utf8Write('"+string+"', 0)")).isEqualTo((long)string.length());
        assertThat(eval("buff.toString()")).isEqualTo(string);
        int idx = 0;
        byte[] stringBytes = string.getBytes("UTF-8");
        for (byte b : stringBytes) {
            assertThat(eval("buff.byteAt("+ idx++ +")")).isEqualTo(b);
        }
    }
    
    @Test
    public void testBufferUtf8WriteWithOffset() throws UnsupportedEncodingException {
        String string = "Now is the winter of our discontent made glorious summer";
        eval("var buff = new JavaBuffer(100)");
        assertThat(eval("buff.utf8Write('"+string+"', 10)")).isEqualTo((long)string.length());
        assertThat(eval("buff.toString()")).isEqualTo(string);
        int idx = 10;
        byte[] stringBytes = string.getBytes("UTF-8");
        for (byte b : stringBytes) {
            assertThat(eval("buff.byteAt("+ idx++ +")")).isEqualTo(b);
        }
    }
    
    @Test
    public void testBufferUtf8WriteWithMaxLength() throws UnsupportedEncodingException {
        String string = "Now is the winter of our discontent made glorious summer";
        eval("var buff = new JavaBuffer(100)");
        eval("buff.fill(0)");
        assertThat(eval("buff.utf8Write('"+string+"', 0, 10)")).isEqualTo(10L);
        assertThat(eval("buff.toString()")).isEqualTo(string.subSequence(0, 10));
        assertThat(eval("buff.byteAt(10)")).isEqualTo((byte)0);
        byte[] stringBytes = string.getBytes("UTF-8");
        for (int i=0; i<10; i++) {
            assertThat(eval("buff.byteAt("+ i +")")).isEqualTo(stringBytes[i]);
        }
    }
}
