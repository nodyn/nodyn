package org.projectodd.nodej;

import static org.fest.assertions.Assertions.assertThat;

import java.io.File;
import java.lang.management.ManagementFactory;
import java.util.Map;

import org.dynjs.runtime.DynObject;
import org.dynjs.runtime.JSFunction;
import org.dynjs.runtime.JSObject;
import org.junit.Test;

public class ProcessTest extends NodejTestSupport {

    @Test
    public void testArgv() {
        assertThat(runtime.evaluate("process.argv")).isEqualTo(defaultArgs);
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
    public void testNextTick() throws InterruptedException {
        eval("var x = 0");
        eval("var f = function(y) { x = x+y }");
        eval("process.nextTick(f, 10)");
        Thread.sleep(100);
        assertThat(eval("x")).isEqualTo(10L);
    }
}
