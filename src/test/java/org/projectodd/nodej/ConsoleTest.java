package org.projectodd.nodej;

import static org.fest.assertions.Assertions.assertThat;

import org.dynjs.exception.ThrowException;
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
    
    @Test
    public void testConsoleDir() {
        assertThat(eval("console.dir(new Date())")).isEqualTo(Types.UNDEFINED);
    }
    
    @Test
    public void testConsoleTime() {
        assertThat(eval("console.time('LABEL')")).isEqualTo(Types.UNDEFINED);
        assertThat(eval("console.timeEnd('LABEL')")).isEqualTo(Types.UNDEFINED);
    }
    
    @Test( expected = ThrowException.class )
    public void testConsoleTimeEndNoLabel() {
        assertThat(eval("console.timeEnd('BAD LABEL')")).isEqualTo(Types.UNDEFINED);
    }
    
    @Test
    public void testConsoleTrace() {
        assertThat(eval("console.trace('label')")).isEqualTo(Types.UNDEFINED);
    }
    
    @Test
    public void testConsoleAssert() {
        assertThat(eval("console.assert(true, 'should not see this')")).isEqualTo(Types.UNDEFINED);
    }
    
    @Test( expected = ThrowException.class )
    public void testConsoleAssertFails() {
        assertThat(eval("console.assert(false, 'EXPECTED')")).isEqualTo(Types.UNDEFINED);
    }
}
