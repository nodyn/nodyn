package org.projectodd.nodej;

import static org.fest.assertions.Assertions.assertThat;

import org.dynjs.exception.ThrowException;
import org.dynjs.runtime.JSObject;
import org.dynjs.runtime.Types;
import org.junit.Test;

public class AssertTest extends NodejTestSupport {

    @Test
    public void testAssertOk() {
        // if != we get an error
        assertThat(eval("require('assert').ok(true)")).isEqualTo(Types.UNDEFINED);
    }
    
    @Test
    public void testAssertFail() {
        try {
            eval("require('assert').fail('actual', 'expected', 'message', null)");
            throw new AssertionError("assert.fail() should have thrown an AssertionError");
        } catch (ThrowException e) {
            JSObject err = (JSObject) e.getValue();
            assertThat(err.get(null, "name")).isEqualTo("AssertionError");
        }
    }
}
