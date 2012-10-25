package org.projectodd.nodej;

import static org.fest.assertions.Assertions.assertThat;

import org.junit.Ignore;
import org.junit.Test;

public class AssertTest extends NodejTestSupport {
    
    @Test
    @Ignore
    public void test() {
        assertThat(this.runtime.evaluate("var x = require('assert')")).isNotEqualTo(null);
        assertThat(this.runtime.evaluate("x.assert(1,1)")).isEqualTo(true);
    }

}
