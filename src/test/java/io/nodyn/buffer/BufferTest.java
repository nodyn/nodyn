/*
 * Copyright 2015 lanceball.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package io.nodyn.buffer;

import java.nio.ByteBuffer;
import java.nio.charset.StandardCharsets;
import javax.script.ScriptContext;
import javax.script.ScriptEngineManager;
import javax.script.ScriptException;
import jdk.nashorn.api.scripting.NashornScriptEngine;
import jdk.nashorn.api.scripting.ScriptObjectMirror;
import org.junit.After;
import org.junit.AfterClass;
import org.junit.Before;
import org.junit.BeforeClass;
import org.junit.Test;
import static org.junit.Assert.*;

/**
 *
 * @author lanceball
 */
public class BufferTest {
    
    private static NashornScriptEngine engine;
    private static ScriptContext global;    
    
    public BufferTest() {
    }
    
    @BeforeClass
    public static void setUpClass() {
        engine = (NashornScriptEngine) new ScriptEngineManager().getEngineByName("nashorn");
        global = engine.getContext();
    }
    
    @AfterClass
    public static void tearDownClass() {
    }
    
    @Before
    public void setUp() {
    }
    
    @After
    public void tearDown() {
    }
    
    public static ScriptObjectMirror createFixture() throws ScriptException {
        return createFixture(null);
    }
    
    public static ScriptObjectMirror createFixture(String s) throws ScriptException {
        ByteBuffer buf;
        ScriptObjectMirror obj = (ScriptObjectMirror) engine.eval("(function () { return {}; })();");
        if (s != null) {
            buf = ByteBuffer.allocate(s.length());
            buf.put(s.getBytes());
        } else {
            buf = ByteBuffer.allocate(64);
        }
        Buffer.inject(obj, buf);
        return obj;
    }
    
    @Test
    public void testCompile() throws ScriptException {
        engine.compile("(function (exports, require, module, __filename, __dirname) {\n" +
"});");
    }
    
    /**
     * Test of inject method, of class Buffer.
     * @throws javax.script.ScriptException
     */
    @Test
    public void testInject() throws ScriptException {
        ByteBuffer buf = ByteBuffer.allocate(64);
        buf.put("guacamole".getBytes());
        ScriptObjectMirror obj = (ScriptObjectMirror) engine.eval("(function () { return {}; })();");
        Buffer.inject(obj, buf);
        assertTrue(obj.containsKey("__rawBuffer__"));
        assertEquals((int)"g".getBytes()[0], obj.getSlot(0));
    }

    /**
     * Test of extract method, of class Buffer.
     * @throws javax.script.ScriptException
     */
    @Test
    public void testExtract() throws ScriptException {
        ScriptObjectMirror obj = createFixture("guacamole");
        ByteBuffer result = Buffer.extract(obj);
        assertEquals(obj.get("__rawBuffer__"), result);
    }

    /**
     * Test of extractByteArray method, of class Buffer.
     * @throws javax.script.ScriptException
     */
    @Test
    public void testExtractByteArray() throws ScriptException {
        String str = "bean dip";
        ScriptObjectMirror object = createFixture(str);
        byte[] expResult = str.getBytes();
        byte[] result = Buffer.extractByteArray(object);
        assertArrayEquals(expResult, result);
    }

    /**
     * Test of bufLen method, of class Buffer.
     * @throws javax.script.ScriptException
     */
    @Test
    public void testBufLen() throws ScriptException {
        String str = "cheeze";
        ScriptObjectMirror obj = createFixture(str);
        int expResult = str.length();
        int result = Buffer.bufLen(obj);
        assertEquals(expResult, result);
    }

    /**
     * Test of fill method, of class Buffer.
     * @throws javax.script.ScriptException
     */
    @Test
    public void testFill() throws ScriptException {
        ScriptObjectMirror obj = createFixture();
        Object val = "a";
        int offset = 0;
        int end = 64;
        byte[] expResult = "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa".getBytes(StandardCharsets.UTF_8);
        Buffer.fill(obj, val, offset, end);
        assertArrayEquals(expResult, Buffer.extractByteArray(obj));
    }

    /**
     * Test of copy method, of class Buffer.
     * @throws javax.script.ScriptException
     */
    @Test
    public void testCopy() throws ScriptException {
        final String memeograph = "memeograph";
        ScriptObjectMirror src = createFixture(memeograph);
        ScriptObjectMirror target = createFixture();
        int targetStart = 0;
        int sourceStart = 0;
        int sourceEnd = 10;
        long expResult = 10L;
        long result = Buffer.copy(src, target, targetStart, sourceStart, sourceEnd);
        // we should have copied 10 bytes
        assertEquals(expResult, result);
        assertEquals(memeograph, Buffer.utf8Slice(target, 0, 10));
//        assertArrayEquals("memograph".getBytes(StandardCharsets.UTF_8), Array.copyOf(Buffer.extractByteArray(target), 9));
    }

    /**
     * Test of utf8Write method, of class Buffer.
     */
    @Test
    public void testUtf8Write() {
        System.out.println("utf8Write");
        ScriptObjectMirror object = null;
        String str = "";
        int offset = 0;
        int len = 0;
        long[] expResult = null;
//        long[] result = Buffer.utf8Write(object, str, offset, len);
//        assertArrayEquals(expResult, result);
//        // TODO review the generated test code and remove the default call to fail.
//        fail("The test case is a prototype.");
    }

    /**
     * Test of utf8Slice method, of class Buffer.
     */
    @Test
    public void testUtf8Slice() {
        System.out.println("utf8Slice");
        ScriptObjectMirror object = null;
        int start = 0;
        int end = 0;
        String expResult = "";
//        String result = Buffer.utf8Slice(object, start, end);
//        assertEquals(expResult, result);
//        // TODO review the generated test code and remove the default call to fail.
//        fail("The test case is a prototype.");
    }

    /**
     * Test of asciiWrite method, of class Buffer.
     */
    @Test
    public void testAsciiWrite() {
        System.out.println("asciiWrite");
        ScriptObjectMirror object = null;
        String str = "";
        int offset = 0;
        int len = 0;
        long expResult = 0L;
//        long result = Buffer.asciiWrite(object, str, offset, len);
//        assertEquals(expResult, result);
//        // TODO review the generated test code and remove the default call to fail.
//        fail("The test case is a prototype.");
    }

    /**
     * Test of asciiSlice method, of class Buffer.
     */
    @Test
    public void testAsciiSlice() throws ScriptException {
        System.out.println("asciiSlice");
        ScriptObjectMirror object = createFixture("Hello, Cleveland!");
        int start = 0;
        int end = 0;
        String expResult = "";
        String result = Buffer.asciiSlice(object, start, end);
//        assertEquals(expResult, result);
    }

    /**
     * Test of ucs2Write method, of class Buffer.
     */
    @Test
    public void testUcs2Write() {
        System.out.println("ucs2Write");
        ScriptObjectMirror object = null;
        String str = "";
        int offset = 0;
        int len = 0;
        long expResult = 0L;
//        long result = Buffer.ucs2Write(object, str, offset, len);
//        assertEquals(expResult, result);
//        // TODO review the generated test code and remove the default call to fail.
//        fail("The test case is a prototype.");
    }

    /**
     * Test of ucs2Slice method, of class Buffer.
     */
    @Test
    public void testUcs2Slice() {
        System.out.println("ucs2Slice");
        ScriptObjectMirror object = null;
        int start = 0;
        int end = 0;
        String expResult = "";
//        String result = Buffer.ucs2Slice(object, start, end);
//        assertEquals(expResult, result);
//        // TODO review the generated test code and remove the default call to fail.
//        fail("The test case is a prototype.");
    }

    /**
     * Test of hexWrite method, of class Buffer.
     */
    @Test
    public void testHexWrite() {
        System.out.println("hexWrite");
        ScriptObjectMirror object = null;
        String str = "";
        int offset = 0;
        int len = 0;
        long expResult = 0L;
//        long result = Buffer.hexWrite(object, str, offset, len);
//        assertEquals(expResult, result);
//        // TODO review the generated test code and remove the default call to fail.
//        fail("The test case is a prototype.");
    }

    /**
     * Test of hexSlice method, of class Buffer.
     */
    @Test
    public void testHexSlice() {
        System.out.println("hexSlice");
        ScriptObjectMirror object = null;
        int start = 0;
        int end = 0;
        String expResult = "";
//        String result = Buffer.hexSlice(object, start, end);
//        assertEquals(expResult, result);
//        // TODO review the generated test code and remove the default call to fail.
//        fail("The test case is a prototype.");
    }

    /**
     * Test of base64Write method, of class Buffer.
     */
    @Test
    public void testBase64Write() {
        System.out.println("base64Write");
        ScriptObjectMirror object = null;
        String str = "";
        int offset = 0;
        int len = 0;
        long expResult = 0L;
//        long result = Buffer.base64Write(object, str, offset, len);
//        assertEquals(expResult, result);
//        // TODO review the generated test code and remove the default call to fail.
//        fail("The test case is a prototype.");
    }

    /**
     * Test of base64Slice method, of class Buffer.
     */
    @Test
    public void testBase64Slice() {
        System.out.println("base64Slice");
        ScriptObjectMirror object = null;
        int start = 0;
        int end = 0;
        String expResult = "";
//        String result = Buffer.base64Slice(object, start, end);
//        assertEquals(expResult, result);
//        // TODO review the generated test code and remove the default call to fail.
//        fail("The test case is a prototype.");
    }

    /**
     * Test of binaryWrite method, of class Buffer.
     */
    @Test
    public void testBinaryWrite() {
        System.out.println("binaryWrite");
        ScriptObjectMirror object = null;
        String str = "";
        int offset = 0;
        int len = 0;
        long expResult = 0L;
//        long result = Buffer.binaryWrite(object, str, offset, len);
//        assertEquals(expResult, result);
//        // TODO review the generated test code and remove the default call to fail.
//        fail("The test case is a prototype.");
    }

    /**
     * Test of binarySlice method, of class Buffer.
     */
    @Test
    public void testBinarySlice() {
        System.out.println("binarySlice");
        ScriptObjectMirror object = null;
        int start = 0;
        int end = 0;
        String expResult = "";
//        String result = Buffer.binarySlice(object, start, end);
//        assertEquals(expResult, result);
//        // TODO review the generated test code and remove the default call to fail.
//        fail("The test case is a prototype.");
    }

    /**
     * Test of writeFloatBE method, of class Buffer.
     */
    @Test
    public void testWriteFloatBE() {
        System.out.println("writeFloatBE");
        ScriptObjectMirror obj = null;
        float value = 0.0F;
        int offset = 0;
//        Buffer.writeFloatBE(obj, value, offset);
//        // TODO review the generated test code and remove the default call to fail.
//        fail("The test case is a prototype.");
    }

    /**
     * Test of readFloatBE method, of class Buffer.
     */
    @Test
    public void testReadFloatBE() {
        System.out.println("readFloatBE");
        ScriptObjectMirror obj = null;
        int offset = 0;
        float expResult = 0.0F;
//        float result = Buffer.readFloatBE(obj, offset);
//        assertEquals(expResult, result, 0.0);
//        // TODO review the generated test code and remove the default call to fail.
//        fail("The test case is a prototype.");
    }

    /**
     * Test of writeFloatLE method, of class Buffer.
     */
    @Test
    public void testWriteFloatLE() {
        System.out.println("writeFloatLE");
        ScriptObjectMirror obj = null;
        float value = 0.0F;
        int offset = 0;
//        Buffer.writeFloatLE(obj, value, offset);
//        // TODO review the generated test code and remove the default call to fail.
//        fail("The test case is a prototype.");
    }

    /**
     * Test of readFloatLE method, of class Buffer.
     */
    @Test
    public void testReadFloatLE() {
        System.out.println("readFloatLE");
        ScriptObjectMirror obj = null;
        int offset = 0;
        float expResult = 0.0F;
//        float result = Buffer.readFloatLE(obj, offset);
//        assertEquals(expResult, result, 0.0);
//        // TODO review the generated test code and remove the default call to fail.
//        fail("The test case is a prototype.");
    }

    /**
     * Test of writeDoubleBE method, of class Buffer.
     */
    @Test
    public void testWriteDoubleBE() {
        System.out.println("writeDoubleBE");
        ScriptObjectMirror obj = null;
        double value = 0.0;
        int offset = 0;
//        Buffer.writeDoubleBE(obj, value, offset);
//        // TODO review the generated test code and remove the default call to fail.
//        fail("The test case is a prototype.");
    }

    /**
     * Test of readDoubleBE method, of class Buffer.
     */
    @Test
    public void testReadDoubleBE() {
        System.out.println("readDoubleBE");
        ScriptObjectMirror obj = null;
        int offset = 0;
        double expResult = 0.0;
//        double result = Buffer.readDoubleBE(obj, offset);
//        assertEquals(expResult, result, 0.0);
//        // TODO review the generated test code and remove the default call to fail.
//        fail("The test case is a prototype.");
    }

    /**
     * Test of writeDoubleLE method, of class Buffer.
     */
    @Test
    public void testWriteDoubleLE() {
        System.out.println("writeDoubleLE");
        ScriptObjectMirror obj = null;
        double value = 0.0;
        int offset = 0;
//        Buffer.writeDoubleLE(obj, value, offset);
//        // TODO review the generated test code and remove the default call to fail.
//        fail("The test case is a prototype.");
    }

    /**
     * Test of readDoubleLE method, of class Buffer.
     */
    @Test
    public void testReadDoubleLE() {
        System.out.println("readDoubleLE");
        ScriptObjectMirror obj = null;
        int offset = 0;
        double expResult = 0.0;
//        double result = Buffer.readDoubleLE(obj, offset);
//        assertEquals(expResult, result, 0.0);
//        // TODO review the generated test code and remove the default call to fail.
//        fail("The test case is a prototype.");
    }
    
}
