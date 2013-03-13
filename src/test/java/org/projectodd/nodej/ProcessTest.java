package org.projectodd.nodej;

import static org.fest.assertions.Assertions.assertThat;

import org.dynjs.runtime.DynObject;
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
    public void testNextTick() throws InterruptedException {
        eval("var x = 0");
        eval("var f = function(y) { x = x+y }");
        eval("process.nextTick(f, 10)");
        Thread.sleep(100);
        assertThat(eval("x")).isEqualTo(10L);
    }
}
