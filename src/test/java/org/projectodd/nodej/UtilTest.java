package org.projectodd.nodej;

import static org.fest.assertions.Assertions.assertThat;

import java.io.IOException;

import org.dynjs.runtime.DynObject;
import org.junit.Ignore;
import org.junit.Test;

public class UtilTest extends NodejTestSupport {

    @Test
    public void testRequireUtil() throws IOException {
        assertThat(runtime.execute("require('util')").getClass()).isEqualTo(DynObject.class);
    }
}
