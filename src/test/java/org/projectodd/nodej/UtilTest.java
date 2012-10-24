package org.projectodd.nodej;

import static org.fest.assertions.Assertions.assertThat;

import java.io.File;
import java.io.IOException;

import org.dynjs.runtime.DynJS;
import org.junit.Before;
import org.junit.Ignore;
import org.junit.Test;

public class UtilTest {

    private DynJS runtime;
    private String[] defaultArgs = { "node" };

    @Before
    public void setUp() throws IOException {
        System.setProperty("dynjs.require.path", new File(".").getCanonicalPath() + "/src/main/javascript/node/lib");
        this.runtime = new DynJS();
        new Process(this.runtime.getExecutionContext().getGlobalObject(), defaultArgs);
    }

    @Test
    @Ignore
    public void testRequireUtil() throws IOException {
        assertThat(this.runtime.evaluate("require('util')")).isNotEqualTo(null);
    }
}
