package org.projectodd.nodej.bindings;

import static org.fest.assertions.Assertions.assertThat;

import java.net.UnknownHostException;

import org.dynjs.runtime.DynArray;
import org.junit.Test;
import org.projectodd.nodej.NodejTestSupport;

public class OsBindingTest extends NodejTestSupport {
    @Test
    public void testOsHostname() throws UnknownHostException {
        assertThat(eval("process.binding('os').getHostname")).isInstanceOf(org.dynjs.runtime.JSFunction.class);
        assertThat(eval("process.binding('os').getHostname()")).isEqualTo(java.net.InetAddress.getLocalHost().getHostName());
    }
    
    @Test
    public void testOsLoadavg() {
        assertThat(eval("process.binding('os').getLoadAvg")).isInstanceOf(org.dynjs.runtime.JSFunction.class);
        assertThat(eval("process.binding('os').getLoadAvg()")).isInstanceOf(DynArray.class);
        assertThat(eval("process.binding('os').getLoadAvg().length")).isEqualTo(3L);
        // TODO: I only know how to get the latest load average, for the last minute, but
        // TODO: node.js returns an array with the load average from the last 1, 5 and 15 minutes
        assertThat(eval("process.binding('os').getLoadAvg()[0] > 0")).isEqualTo(true);
        assertThat(eval("process.binding('os').getLoadAvg()[1] > 0")).isEqualTo(true);
        assertThat(eval("process.binding('os').getLoadAvg()[2] > 0")).isEqualTo(true);
    }
    
    @Test
    public void testOSUptime() {
        assertThat(eval("process.binding('os').getUptime")).isInstanceOf(org.dynjs.runtime.JSFunction.class);
        assertThat(eval("process.binding('os').getUptime()>0")).isEqualTo(true);
    }

    @Test
    public void testOSFreeMem() {
        assertThat(eval("process.binding('os').getFreeMem")).isInstanceOf(org.dynjs.runtime.JSFunction.class);
        assertThat(eval("process.binding('os').getFreeMem()>0")).isEqualTo(true);
    }

    @Test
    public void testOSTotalMem() {
        assertThat(eval("process.binding('os').getTotalMem")).isInstanceOf(org.dynjs.runtime.JSFunction.class);
        assertThat(eval("process.binding('os').getTotalMem()>0")).isEqualTo(true);
    }
}
