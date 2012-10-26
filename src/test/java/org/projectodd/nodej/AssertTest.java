package org.projectodd.nodej;

import static org.fest.assertions.Assertions.assertThat;

import org.junit.Ignore;
import org.junit.Test;

public class AssertTest extends NodejTestSupport {
    
    @Test
    @Ignore
    public void testAssert() {
        assertThat(eval("var a = require('assert'); a.equal(1,1)")).isEqualTo(true);
    }

}
