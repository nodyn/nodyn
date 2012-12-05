package org.projectodd.nodej;

import org.junit.Test;

public class BufferTest extends NodejTestSupport {

    @Test
    public void testRequireBuffer() {
        eval("var buffer = require('buffer')");
    }
    
}
