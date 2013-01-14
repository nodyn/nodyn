package org.projectodd.nodej;

import static org.fest.assertions.Assertions.assertThat;

import org.dynjs.runtime.DynObject;
import org.dynjs.runtime.JSFunction;
import org.junit.Before;
import org.junit.Test;

public class NetTest extends NodejTestSupport {

    @Before
    public void setUp() {
        super.setUp();
        eval("var net = require('net')");
    }
    
    @Test
    public void isValidRequire() {
        assertThat(eval("net")).isInstanceOf(DynObject.class);
    }
    
    @Test
    public void  serverIsFunction() {
        assertThat(eval("net.Server")).isInstanceOf(JSFunction.class);
    }
    
    @Test
    public void  socketIsFunction() {
        assertThat(eval("net.Socket")).isInstanceOf(JSFunction.class);
    }
    
    @Test
    public void createServerTest() {
        assertThat(eval("net.createServer")).isInstanceOf(JSFunction.class);
    }
    
    @Test
    public void serverListenTest() throws InterruptedException {
        eval("server = net.createServer()");
        eval("listening = false");
        eval("listenCallback = function() { listening = true; }");
        eval("server.listen(80, listenCallback)");
        Thread.sleep(100);
        assertThat(eval("listening")).isEqualTo(true);
    }
}
