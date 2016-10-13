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
package io.nodyn.runtime.nashorn;

import io.nodyn.NodeProcess;
import io.nodyn.runtime.NodynConfig;
import io.nodyn.runtime.Program;
import org.junit.After;
import org.junit.AfterClass;
import org.junit.Before;
import org.junit.BeforeClass;
import org.junit.Test;
import static org.junit.Assert.*;
import org.vertx.java.core.Vertx;
import org.vertx.java.core.VertxFactory;

import java.io.File;
import java.io.FileWriter;
import java.io.IOException;

/**
 *
 * @author lanceball
 */
public class NashornRuntimeTest {
    Vertx vertx;
    NodynConfig config;
    NashornRuntime runtime;

    public NashornRuntimeTest() {
    }

    @BeforeClass
    public static void setUpClass() {
    }

    @AfterClass
    public static void tearDownClass() {
    }

    @Before
    public void setUp() {
        vertx = VertxFactory.newVertx();
        config = new NodynConfig();
        runtime = new NashornRuntime(config, vertx, false);
    }

    @After
    public void tearDown() {
        vertx.stop();
    }

    /**
     * Test of loadBinding method, of class NashornRuntime.
     */
    @Test
    public void testLoadBinding() {
//        Object result = runtime.loadBinding("v8");
//        assertEquals(true, result instanceof JSObject);
//
//        // the v8 module has a function let's see if we can access it
//        JSObject exports = (JSObject) result;
//        JSObject f = (JSObject) exports.getMember("getHeapStatistics");
//        assertEquals(true, f != null);
//        assertEquals("Function", f.getClassName());
    }

    @Test
    public void testBuffer() throws Throwable {
        runtime.initialize();
        Program p = runtime.compile("var b1 = new Buffer('hello world'),"
              + "    b2 = new Buffer(64);"
              + "b1.copy(b2);"
              + "print(b2);"
              + "b2;", "testBuffer.js", true);
        p.execute(runtime.getGlobalContext());
    }

    @Test
    public void testReadFileSync() throws Throwable {
        NodynConfig config = new NodynConfig(new String[] {"-e", "process"});
        NashornRuntime instance = new NashornRuntime(config);
        instance.initialize();

        File tempFile = File.createTempFile("testReadSync", "txt");
        tempFile.deleteOnExit();
        FileWriter fileWriter = new FileWriter(tempFile);
        String testString = "test";
        fileWriter.write(testString);
        fileWriter.close();

        Program p = instance.compile("require('fs').readFileSync('" + tempFile.getAbsolutePath() + "' , {encoding: 'UTF-8'})", "testReadSync", true);
        Object fileContent = p.execute(instance.getGlobalContext());
        assertEquals(testString, fileContent);
    }

    /**
     * Test of compile method, of class NashornRuntime.
     */
    @Test
    public void testCompile() throws Exception, Throwable {
        String source = "var foo = 'bar'; foo";
        boolean displayErrors = false;
        Program program = runtime.compile(source, null, displayErrors);
        assertNotEquals(null, program);
        Object result = program.execute(runtime.getGlobalContext());
        assertEquals("bar", result);
    }

    /**
     * Test of makeContext method, of class NashornRuntime.
     */
    @Test
    public void testMakeContext() {
        System.out.println("makeContext");
        Object global = null;
        NashornRuntime instance = new NashornRuntime(config, vertx, false);
//        instance.makeContext(global);
        // TODO review the generated test code and remove the default call to fail.
        //fail("The test case is a prototype.");
    }

    /**
     * Test of isContext method, of class NashornRuntime.
     */
    @Test
    public void testIsContext() {
        System.out.println("isContext");
        Object global = null;
        NashornRuntime instance = new NashornRuntime(config, vertx, false);
        boolean expResult = false;
//        boolean result = instance.isContext(global);
//        assertEquals(expResult, result);
        // TODO review the generated test code and remove the default call to fail.
        //fail("The test case is a prototype.");
    }

    /**
     * Test of handleThrowable method, of class NashornRuntime.
     */
    @Test
    public void testHandleThrowable() {
        System.out.println("handleThrowable");
        Throwable t = new Exception("A test exception - this should appear in build output.");
        NashornRuntime instance = new NashornRuntime(config, vertx, false);
        instance.handleThrowable(t);
        // TODO review the generated test code and remove the default call to fail.
        //fail("The test case is a prototype.");
    }

    /**
     * Test of initialize method, of class NashornRuntime.
     */
    @Test
    public void testInitialize() {
        System.out.println("initialize");
        NashornRuntime instance = new NashornRuntime(config, vertx, false);
        NodeProcess expResult = null;
        NodeProcess result = instance.initialize();
//        assertEquals(expResult, result);
        // TODO review the generated test code and remove the default call to fail.
        //fail("The test case is a prototype.");
    }

    /**
     * Test of runScript method, of class NashornRuntime.
     */
    @Test
    public void testRunScript() {
        System.out.println("runScript");
        String script = "";
        NashornRuntime instance = new NashornRuntime(config, vertx, false);
        Object expResult = null;
//        Object result = instance.runScript(script);
//        assertEquals(expResult, result);
        // TODO review the generated test code and remove the default call to fail.
        //fail("The test case is a prototype.");
    }

    /**
     * Test of getGlobalContext method, of class NashornRuntime.
     */
    @Test
    public void testGetGlobalContext() {
        System.out.println("getGlobalContext");
        NashornRuntime instance = new NashornRuntime(config, vertx, false);
        Object expResult = null;
        Object result = instance.getGlobalContext();
//        assertEquals(expResult, result);
        // TODO review the generated test code and remove the default call to fail.
        //fail("The test case is a prototype.");
    }

}
