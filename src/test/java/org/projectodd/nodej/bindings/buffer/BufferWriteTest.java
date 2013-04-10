package org.projectodd.nodej.bindings.buffer;

import static org.fest.assertions.Assertions.assertThat;

import java.io.UnsupportedEncodingException;

import org.dynjs.runtime.Types;
import org.junit.Before;
import org.junit.Ignore;
import org.junit.Test;
import org.projectodd.nodej.NodejTestSupport;

public class BufferWriteTest extends NodejTestSupport {
    String string = "Now is the winter of our discontent made glorious summer";
    
    @Before
    public void setUp() {
        super.setUp();
        eval("var assert = require('assert')");
        eval("var JavaBuffer = process.binding('buffer').SlowBuffer");
        eval("var buff = new JavaBuffer(70)");
        eval("buff.fill(0)");
    }

    @Test
    public void testBufferAsciiWrite() throws UnsupportedEncodingException {
        assertThat(eval("buff.asciiWrite('"+string+"', 0)")).isEqualTo((long)string.length());
        assertThat(eval("buff.toString()")).isEqualTo(string);
        int idx = 0;
        byte[] stringBytes = string.getBytes("US-ASCII");
        for (byte b : stringBytes) {
            assertThat(eval("buff["+ idx++ +"] == " + b)).isEqualTo(true);
        }
    }
    
    @Test
    public void testBufferAsciiWriteWithOffset() throws UnsupportedEncodingException {
        assertThat(eval("buff.asciiWrite('"+string+"', 10)")).isEqualTo((long)string.length());
        assertThat(eval("buff.toString()")).isEqualTo(string);
        int idx = 10;
        byte[] stringBytes = string.getBytes("US-ASCII");
        for (byte b : stringBytes) {
            assertThat(eval("buff["+ idx++ +"] == " + b)).isEqualTo(true);
        }
    }
    
    @Test
    public void testBufferAsciiWriteWithMaxLength() throws UnsupportedEncodingException {
        assertThat(eval("buff.asciiWrite('"+string+"', 0, 10)")).isEqualTo(10L);
        assertThat(eval("buff.toString()")).isEqualTo(string.subSequence(0, 10));
        assertThat(eval("buff[10]")).isEqualTo(Types.UNDEFINED);
        byte[] stringBytes = string.getBytes("US-ASCII");
        for (int i=0; i<10; i++) {
            assertThat(eval("buff["+ i +"] == " + stringBytes[i])).isEqualTo(true);
        }
    }

    @Test
    @Ignore
    public void testBufferBinaryWrite() throws UnsupportedEncodingException {
        assertThat(eval("buff.binaryWrite('"+string+"', 0)")).isEqualTo((long)string.length());
        assertThat(eval("buff.toString()")).isEqualTo(string);
        int idx = 0;
        byte[] stringBytes = string.getBytes("US-ASCII");
        for (byte b : stringBytes) {
            assertThat(eval("buff.byteAt("+ idx++ +")")).isEqualTo(b);
        }
    }
    
    @Test
    @Ignore
    public void testBufferBinaryWriteWithOffset() throws UnsupportedEncodingException {
        assertThat(eval("buff.binaryWrite('"+string+"', 10)")).isEqualTo((long)string.length());
        assertThat(eval("buff.toString()")).isEqualTo(string);
        int idx = 10;
        byte[] stringBytes = string.getBytes("US-ASCII");
        for (byte b : stringBytes) {
            assertThat(eval("buff.byteAt("+ idx++ +")")).isEqualTo(b);
        }
    }
    
    @Test
    @Ignore
    public void testBufferBinaryWriteWithMaxLength() throws UnsupportedEncodingException {
        assertThat(eval("buff.binaryWrite('"+string+"', 0, 10)")).isEqualTo(10L);
        assertThat(eval("buff.toString()")).isEqualTo(string.subSequence(0, 10));
        assertThat(eval("buff.byteAt(10)")).isEqualTo((byte)0);
        byte[] stringBytes = string.getBytes("US-ASCII");
        for (int i=0; i<10; i++) {
            assertThat(eval("buff.byteAt("+ i +")")).isEqualTo(stringBytes[i]);
        }
    }
}
