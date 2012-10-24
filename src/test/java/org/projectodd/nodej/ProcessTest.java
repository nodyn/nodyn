package org.projectodd.nodej;

import static org.fest.assertions.Assertions.assertThat;

import org.dynjs.runtime.DynJS;
import org.junit.Before;
import org.junit.Test;

public class ProcessTest {

    private DynJS runtime;
    private String[] defaultArgs = { "node", "somearg" };

    @Before
    public void setUp() {
        this.runtime = new DynJS();
        new Process(this.runtime.getExecutionContext().getGlobalObject(), defaultArgs);
    }

    @Test
    public void testArgv() {
        assertThat(this.runtime.evaluate("process.argv")).isEqualTo(defaultArgs);
    }

    @Test
    public void testStdOut() {
        assertThat(this.runtime.evaluate("process.stdout")).isEqualTo(runtime.getConfig().getOutputStream());
    }

    @Test
    public void testStdErr() {
        assertThat(this.runtime.evaluate("process.stderr")).isEqualTo(runtime.getConfig().getErrorStream());
    }

    @Test
    public void testArch() {
        assertThat(this.runtime.evaluate("process.arch")).isEqualTo("java");
    }

    @Test
    public void testPlatform() {
        assertThat(this.runtime.evaluate("process.platform")).isEqualTo("java");
    }

    @Test
    public void testVersion() {
        assertThat(this.runtime.evaluate("process.version")).isEqualTo(Node.VERSION);
    }
}
