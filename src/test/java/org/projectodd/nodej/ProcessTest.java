package org.projectodd.nodej;

import static org.fest.assertions.Assertions.assertThat;

import java.io.File;
import java.lang.management.ManagementFactory;
import java.util.Map;

import org.dynjs.runtime.DynObject;
import org.dynjs.runtime.JSFunction;
import org.dynjs.runtime.JSObject;
import org.junit.Ignore;
import org.junit.Test;

public class ProcessTest extends NodejTestSupport {

    @Test
    public void testArgv() {
        assertThat(runtime.evaluate("process.argv")).isEqualTo(defaultArgs);
    }

    @Test
    public void testStdOut() {
        assertThat(runtime.evaluate("process.stdout")).isInstanceOf(DynObject.class);
        assertThat(runtime.evaluate("process.stdout.write")).isInstanceOf(JSFunction.class);
    }

    @Test
    public void testStdErr() {
        assertThat(runtime.evaluate("process.stderr")).isInstanceOf(DynObject.class);
        assertThat(runtime.evaluate("process.stderr.write")).isInstanceOf(JSFunction.class);
    }
    
    @Test
    public void testExecPath() {
        assertThat(runtime.evaluate("process.execPath")).isEqualTo(new File("node").getAbsolutePath());
    }

    @Test
    public void testArch() {
        assertThat(runtime.evaluate("process.arch")).isEqualTo("java");
    }

    @Test
    public void testPlatform() {
        assertThat(runtime.evaluate("process.platform")).isEqualTo("java");
    }
    
    @Test
    public void testMemoryUsage() {
        assertThat(runtime.evaluate("var mem = process.memoryUsage(); mem")).isInstanceOf(DynObject.class);
        assertThat(runtime.evaluate("mem.heapTotal")).isInstanceOf(Number.class);
        assertThat(runtime.evaluate("mem.heapUsed")).isInstanceOf(Number.class);
        assertThat(runtime.evaluate("mem.heapTotal > mem.heapUsed")).isEqualTo(true);
    }
    
    @Test
    public void testProcessEvents() {
        assertThat(runtime.evaluate("process.addListener")).isInstanceOf(JSFunction.class);
        assertThat(runtime.evaluate("process.on")).isInstanceOf(JSFunction.class);
        assertThat(runtime.evaluate("process.once")).isInstanceOf(JSFunction.class);
        assertThat(runtime.evaluate("process.removeListener")).isInstanceOf(JSFunction.class);
        assertThat(runtime.evaluate("process.removeAllListeners")).isInstanceOf(JSFunction.class);
        assertThat(runtime.evaluate("process.setMaxListeners")).isInstanceOf(JSFunction.class);
        assertThat(runtime.evaluate("process.listeners")).isInstanceOf(JSFunction.class);
        assertThat(runtime.evaluate("process.emit")).isInstanceOf(JSFunction.class);
    }

    @Test
    public void testVersion() {
        assertThat(runtime.evaluate("process.version")).isEqualTo(Node.VERSION);
    }
    
    @Test
    public void testConfig() {
        assertThat(runtime.evaluate("process.config")).isInstanceOf(DynObject.class);
    }
    
    @Test
    public void testPid() {
        assertThat(runtime.evaluate("process.pid")).isEqualTo(ManagementFactory.getRuntimeMXBean().getName());
    }
    
    @Test
    public void testVersions() {
        assertThat(runtime.evaluate("process.versions")).isInstanceOf(JSObject.class);
        assertThat(runtime.evaluate("process.versions.node")).isEqualTo(org.projectodd.nodej.Node.VERSION);
        assertThat(runtime.evaluate("process.versions.java")).isEqualTo(System.getProperty("java.version"));
        assertThat(runtime.evaluate("process.versions.dynjs")).isEqualTo(org.dynjs.DynJSVersion.FULL);
    }
    
    @Test
    public void testEnv() {
        assertThat(runtime.evaluate("process.env")).isInstanceOf(JSObject.class);
        Map<String,String> env = System.getenv();
        for (String key : env.keySet()) {
            assertThat(runtime.evaluate("process.env."+key.replaceAll("[\\./]", "_"))).isEqualTo(env.get(key));
        }
    }
    
    @Test
    public void testCwd() {
        assertThat(runtime.evaluate("process.cwd()")).isEqualTo(System.getProperty("user.dir"));
    }

    @Test
    public void testNoDeprecation() {
        assertThat(runtime.evaluate("process.noDeprecation")).isEqualTo(false);
    }

    @Test
    public void testTraceDeprecation() {
        assertThat(runtime.evaluate("process.traceDeprecation")).isEqualTo(false);
    }
    
    @Test
    public void testTitle() {
        assertThat(runtime.evaluate("process.title")).isEqualTo("nodej");
        runtime.evaluate("process.title = 'something else'");
        assertThat(runtime.evaluate("process.title")).isEqualTo("something else");
    }
    
    @Test
    public void testGlobalness() {
        assertThat(runtime.evaluate("var x = function() { return process.title }; x()")).isEqualTo("nodej");
    }
    
    @Test
    public void testNextTick() throws InterruptedException {
        eval("var x = 0");
        eval("var f = function(y) { x = x+y }");
        eval("process.nextTick(f, 10)");
        Thread.sleep(100);
        assertThat(eval("x")).isEqualTo(10L);
    }
}
