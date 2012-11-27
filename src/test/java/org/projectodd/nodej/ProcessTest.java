package org.projectodd.nodej;

import static org.fest.assertions.Assertions.assertThat;

import java.net.UnknownHostException;

import org.dynjs.runtime.DynArray;
import org.junit.Test;

public class ProcessTest extends NodejTestSupport {

    @Test
    public void testArgv() {
        assertThat(runtime.evaluate(runtime.getExecutionContext(), "process.argv", false, true)).isEqualTo(defaultArgs);
    }

    @Test
    public void testStdOut() {
        assertThat(runtime.evaluate("process.stdout")).isNotNull();
    }

    @Test
    public void testStdErr() {
        assertThat(runtime.evaluate("process.stderr")).isNotNull();
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
    public void testVersion() {
        assertThat(runtime.evaluate("process.version")).isEqualTo(Node.VERSION);
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
}
