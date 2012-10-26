package org.projectodd.nodej;

import static org.fest.assertions.Assertions.assertThat;

import java.io.IOException;

import org.dynjs.runtime.DynObject;
import org.dynjs.runtime.Types;
import org.junit.Ignore;
import org.junit.Test;

public class UtilTest extends NodejTestSupport {

    @Test
    public void testRequireUtil() throws IOException {
        assertThat(eval("require('util')").getClass()).isEqualTo(DynObject.class);
    }
    
    @Test
    @Ignore // Pending implementation of String.prototype.replace in dynjs 
    public void testFormat() {
        assertThat(eval("require('util').format('1 2 3')")).isEqualTo("1 2 3");
    }
    
    @Test
    public void testDebug() {
        // Only ensures we don't fail
        assertThat(eval("require('util').debug('message to stderr')")).isEqualTo(Types.UNDEFINED);
    }
}
