package org.projectodd.nodej.bindings.fs;

import static org.fest.assertions.Assertions.assertThat;


import org.dynjs.runtime.AbstractNativeFunction;
import org.junit.Before;
import org.junit.Test;
import org.projectodd.nodej.NodejTestSupport;

public class StatsTest extends NodejTestSupport {
    @Before
    public void setUp() {
        super.setUp();
        eval("var Stats = process.binding('fs').Stats");
    }

    @Test
    public void testIsDirectory() {
        assertThat(eval("Stats.prototype.isDirectory")).isInstanceOf(AbstractNativeFunction.class);
        assertThat(eval("Stats.prototype.isDirectory()")).isEqualTo(false);
    }
    
}
