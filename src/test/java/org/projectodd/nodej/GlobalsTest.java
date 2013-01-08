package org.projectodd.nodej;

import static org.fest.assertions.Assertions.assertThat;

import org.dynjs.runtime.GlobalObject;
import org.dynjs.runtime.JSFunction;
import org.dynjs.runtime.JSObject;
import org.junit.Test;

public class GlobalsTest extends NodejTestSupport {

    @Test
    public void testGlobals() {
        assertThat(eval("global")).isInstanceOf(GlobalObject.class);
        assertThat(eval("process")).isInstanceOf(Process.class);
        assertThat(eval("process")).isInstanceOf(JSObject.class);
        assertThat(eval("Buffer")).isInstanceOf(JSFunction.class);
        assertThat(eval("require")).isInstanceOf(JSFunction.class);
        // TODO
//        assertThat(eval("require.resolve")).isInstanceOf(JSFunction.class);
//        assertThat(eval("require.cache")).isInstanceOf(JSObject.class);
//        assertThat(eval("require.extensions")).isInstanceOf(DynArray.class);
        assertThat(eval("__filename")).isInstanceOf(String.class);
        assertThat(eval("__dirname")).isInstanceOf(String.class);
        assertThat(eval("setTimeout")).isInstanceOf(JSFunction.class);
        assertThat(eval("clearTimeout")).isInstanceOf(JSFunction.class);
        assertThat(eval("setInterval")).isInstanceOf(JSFunction.class);
        assertThat(eval("clearInterval")).isInstanceOf(JSFunction.class);
    }
}
