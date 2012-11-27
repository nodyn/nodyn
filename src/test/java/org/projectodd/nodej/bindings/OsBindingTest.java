package org.projectodd.nodej.bindings;

import static org.fest.assertions.Assertions.assertThat;

import java.net.UnknownHostException;

import org.dynjs.runtime.DynArray;
import org.dynjs.runtime.JSFunction;
import org.junit.Test;
import org.junit.Ignore;
import org.projectodd.nodej.NodejTestSupport;

public class OsBindingTest extends NodejTestSupport {
    @Test
    public void testOsHostname() throws UnknownHostException {
        assertThat(eval("process.binding('os').getHostname")).isInstanceOf(JSFunction.class);
        assertThat(eval("process.binding('os').getHostname()")).isEqualTo(java.net.InetAddress.getLocalHost().getHostName());
    }
    
    @Test
    public void testOsLoadavg() {
        assertThat(eval("process.binding('os').getLoadAvg")).isInstanceOf(JSFunction.class);
        assertThat(eval("process.binding('os').getLoadAvg()")).isInstanceOf(DynArray.class);
        assertThat(eval("process.binding('os').getLoadAvg().length")).isEqualTo(3L);
        assertThat(eval("process.binding('os').getLoadAvg()[0] > 0")).isEqualTo(true);
        assertThat(eval("process.binding('os').getLoadAvg()[1] > 0")).isEqualTo(true);
        assertThat(eval("process.binding('os').getLoadAvg()[2] > 0")).isEqualTo(true);
    }
    
    @Test
    public void testOSUptime() {
        assertThat(eval("process.binding('os').getUptime")).isInstanceOf(JSFunction.class);
        assertThat(eval("process.binding('os').getUptime()>0")).isEqualTo(true);
    }

    @Test
    public void testOSFreeMem() {
        assertThat(eval("process.binding('os').getFreeMem")).isInstanceOf(JSFunction.class);
        assertThat(eval("process.binding('os').getFreeMem()>0")).isEqualTo(true);
    }

    @Test
    public void testOSTotalMem() {
        assertThat(eval("process.binding('os').getTotalMem")).isInstanceOf(JSFunction.class);
        assertThat(eval("process.binding('os').getTotalMem()>0")).isEqualTo(true);
    }
    
    @Test
    @Ignore
    public void testOSType() {
        assertThat(eval("process.binding('os').getOSType")).isInstanceOf(JSFunction.class);
        assertThat(eval("process.binding('os').getOSType()")).isEqualTo("foo");
    }
}
