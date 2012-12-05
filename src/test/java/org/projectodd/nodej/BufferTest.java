package org.projectodd.nodej;

import org.junit.Ignore;
import org.junit.Test;

public class BufferTest extends NodejTestSupport {

    @Test
    @Ignore
    public void testRequireBuffer() {
        eval("var buffer = require('buffer')");
    }
    
}
