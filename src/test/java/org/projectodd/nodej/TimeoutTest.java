package org.projectodd.nodej;

import static org.fest.assertions.Assertions.assertThat;

import org.dynjs.runtime.Types;
import org.junit.Test;

public class TimeoutTest extends NodejTestSupport {

    @Test
    public void testSetTimeout() throws InterruptedException {
        eval("var x = 0");
        eval("var f = function() { x = x+1 }");
        eval("setTimeout(f, 1)");
        Thread.sleep(100);
        assertThat(eval("x")).isEqualTo(1L);
    }
    
    @Test
    public void testSetTimeoutReturnsID() {
        eval("var hello = function() { console.log('hello') }");
        assertThat(eval("setTimeout(hello, 1)")).isNotEqualTo(Types.NULL);
    }
    
    @Test
    public void testSetTimeoutPassesArgs() throws InterruptedException {
        eval("var x = 0");
        eval("var f = function(y) { x = x+y }");
        eval("setTimeout(f, 1, 5)");
        Thread.sleep(100);
        assertThat(eval("x")).isEqualTo(5L);
    }
    
    @Test
    public void testSetTimeoutWaits() throws InterruptedException {
        eval("var x = 0");
        eval("var f = function(y) { x = x+y }");
        eval("setTimeout(f, 100, 5)");
        assertThat(eval("x")).isEqualTo(0L);
        Thread.sleep(500);
        assertThat(eval("x")).isEqualTo(5L);
    }
    
    @Test
    public void testClearTimeout() throws InterruptedException {
        eval("var x = 0");
        eval("var f = function(y) { x = x+y }");
        eval("var id = setTimeout(f, 1000, 5)");
        eval("clearTimeout(id)");
        Thread.sleep(1000);
        assertThat(eval("x")).isEqualTo(0L);
    }
    
    @Test
    public void testSetInterval() throws InterruptedException {
        eval("var x = 0");
        eval("var f = function() { x = x+1 }");
        eval("setInterval(f, 10)");
        Thread.sleep(100);
        assertThat(eval("x>1")).isEqualTo(true);
    }
    
    @Test
    public void testClearInterval() throws InterruptedException {
        eval("var x = 0");
        eval("var f = function() { x = x+1 }");
        eval("var id = setInterval(f, 10000)");
        eval("clearInterval(id)");
        Thread.sleep(500);
        assertThat(eval("x")).isEqualTo(0L);
    }
}
