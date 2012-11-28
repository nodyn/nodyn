package org.projectodd.nodej.bindings;


import org.dynjs.runtime.DynObject;
import org.dynjs.runtime.GlobalObject;
import org.projectodd.nodej.bindings.os.GetCPUs;
import org.projectodd.nodej.bindings.os.GetFreeMem;
import org.projectodd.nodej.bindings.os.GetHostname;
import org.projectodd.nodej.bindings.os.GetLoadAvg;
import org.projectodd.nodej.bindings.os.GetOSRelease;
import org.projectodd.nodej.bindings.os.GetOSType;
import org.projectodd.nodej.bindings.os.GetTotalMem;
import org.projectodd.nodej.bindings.os.GetUptime;

public class Os extends DynObject {

    public Os(final GlobalObject globalObject) {
        super(globalObject);
        Binding.setProperty(this, "getHostname",  new GetHostname(globalObject));
        Binding.setProperty(this, "getLoadAvg",   new GetLoadAvg(globalObject));
        Binding.setProperty(this, "getUptime",    new GetUptime(globalObject));
        Binding.setProperty(this, "getFreeMem",   new GetFreeMem(globalObject));
        Binding.setProperty(this, "getTotalMem",  new GetTotalMem(globalObject));
        Binding.setProperty(this, "getCPUs",      new GetCPUs(globalObject));
        Binding.setProperty(this, "getOSType",    new GetOSType(globalObject));
        Binding.setProperty(this, "getOSRelease", new GetOSRelease(globalObject));
    }
}
