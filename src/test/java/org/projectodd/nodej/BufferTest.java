package org.projectodd.nodej;

import org.junit.Ignore;
import org.junit.Test;

public class BufferTest extends NodejTestSupport {

    @Test
    @Ignore 
    public void testRequireBuffer() {
        // TODO: Figure out what to do about process.binding()
        // Node's process.binding is used by buffer and is considered 'private'
        // https://groups.google.com/forum/?fromgroups=#!topic/nodejs/R5fDzBr0eEk
        // "It's a static type map defined in src/node.cc that provides glue
        // between c++ and js code. it's meant for nodejs core modules only, like
        // fs and buffer, not third-party extensions."
        eval("var buffer = require('buffer')");
    }
    
}
