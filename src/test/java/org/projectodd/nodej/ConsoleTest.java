package org.projectodd.nodej;

import static org.fest.assertions.Assertions.assertThat;

import org.dynjs.runtime.Types;
import org.junit.Test;
import org.projectodd.nodej.bindings.console.Logger;

public class ConsoleTest extends NodejTestSupport {

    @Test
    public void testConsoleLoggerClass() {
        assertThat(eval("console.logger")).isInstanceOf(Logger.class);
    }
    
    @Test
    public void testConsoleLog() {
        assertThat(eval("console.log('hello log')")).isEqualTo(Types.UNDEFINED);
    }
    
    @Test
    public void testConsoleInfo() {
        assertThat(eval("console.info('hello info')")).isEqualTo(Types.UNDEFINED);
    }
    
    @Test
    public void testConsoleWarn() {
        assertThat(eval("console.warn('hello warn')")).isEqualTo(Types.UNDEFINED);
    }
    
    @Test
    public void testConsoleError() {
        assertThat(eval("console.error('hello error')")).isEqualTo(Types.UNDEFINED);
    }
}
