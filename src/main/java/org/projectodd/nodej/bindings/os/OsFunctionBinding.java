package org.projectodd.nodej.bindings.os;

import java.util.HashMap;
import java.util.Map;

import org.dynjs.runtime.AbstractNativeFunction;
import org.dynjs.runtime.GlobalObject;

public abstract class OsFunctionBinding extends AbstractNativeFunction {

    private static Map<String, String> osNames = new HashMap<String, String>();

    static {
        osNames.put("MacOSX", "Darwin");
    }

    public OsFunctionBinding(GlobalObject globalObject) {
        super(globalObject);
        gatherSystemInfo();
    }

    protected Object getTotalMemory() {
        // TODO: Find Sigar replacement
        return "NOT IMPLEMENTED";
    }

    protected Object getUptime() {
        // TODO: Find Sigar replacement
        return "NOT IMPLEMENTED";
    }

    protected void gatherSystemInfo() {
        // TODO: Find Sigar replacement
    }

    protected Object getOSType() {
        // TODO: Find Sigar replacement
        return "NOT IMPLEMENTED";
    }

    protected Object getLoadAverage() {
        // TODO: Find Sigar replacement
        return "NOT IMPLEMENTED";
    }

    protected Object getFreeMemory() {
        // TODO: Find Sigar replacement
        return "NOT IMPLEMENTED";
    }

    protected Object getOSRelease() {
        // TODO: Find Sigar replacement
        return "NOT IMPLEMENTED";
    }
    
    protected Object getInterfaceAddresses() {
        // TODO: Find Sigar replacement
        return "NOT IMPLEMENTED";
    }

    protected Object getCPUs() {
        // TODO: Find Sigar replacement
        return "NOT IMPLEMENTED";
    }
}