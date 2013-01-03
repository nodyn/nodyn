package org.projectodd.nodej;

import static org.fest.assertions.Assertions.assertThat;

import org.dynjs.runtime.Types;
import org.junit.Test;
import org.projectodd.nodej.bindings.console.Logger;

public class ConsoleTest extends NodejTestSupport {

    @Test
    public void testConsoleLog() {
        assertThat(eval("console.logger")).isInstanceOf(Logger.class);
        assertThat(eval("console.log('hello yaks')")).isEqualTo(Types.UNDEFINED);
    }
}
