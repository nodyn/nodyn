package org.projectodd.nodej;

import static org.fest.assertions.Assertions.assertThat;

import java.util.concurrent.Future;

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
    public void testSetTimeoutReturnsFuture() {
        eval("var hello = function() { console.log('hello') }");
        assertThat(eval("setTimeout(hello, 1)")).isInstanceOf(Future.class);
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
        eval("var f = function() { x = x+5 }");
        eval("setTimeout(f, 100)");
        assertThat(eval("x")).isEqualTo(0L);
        Thread.sleep(500);
        assertThat(eval("x")).isEqualTo(5L);
    }
    
    @Test
    public void testClearTimeout() throws InterruptedException {
        eval("var x = 0");
        eval("var f = function(y) { x = x+y }");
        eval("var id = setTimeout(f, 500, 5)");
        assertThat(eval("clearTimeout(id)")).isEqualTo(true);
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
        eval("var id = setInterval(f, 500)");
        assertThat(eval("clearInterval(id)")).isEqualTo(true);
    }
}
