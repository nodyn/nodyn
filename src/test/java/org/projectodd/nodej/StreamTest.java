package org.projectodd.nodej;

import static org.fest.assertions.Assertions.assertThat;

import org.dynjs.runtime.JSFunction;
import org.junit.Test;

public class StreamTest extends NodejTestSupport {

    @Test
    public void testRequireStream() {
        assertThat(eval("require('stream')")).isInstanceOf(JSFunction.class);
    }
}
