package org.projectodd.nodej.bindings.os;

import java.util.HashMap;
import java.util.Map;

import org.dynjs.runtime.AbstractNativeFunction;
import org.dynjs.runtime.DynArray;
import org.dynjs.runtime.GlobalObject;
import org.hyperic.sigar.Sigar;
import org.hyperic.sigar.SigarException;
import org.hyperic.sigar.SysInfo;

public abstract class OsFunctionBinding extends AbstractNativeFunction {

    private static Map<String, String> osNames = new HashMap<String, String>();
    private GlobalObject globalObject;
    private Sigar sigar = new Sigar();
    private SysInfo sysInfo;

    
    static {
        osNames.put("MacOSX", "Darwin");
    }
    
    public OsFunctionBinding(GlobalObject globalObject) {
        super(globalObject);
        this.globalObject = globalObject;
    }
    
    
    protected Object getTotalMemory() {
        try {
            return sigar.getMem().getTotal();
        } catch (SigarException e) {
            e.printStackTrace();
            return -1;
        }
    }

    protected Object getUptime() {
        try {
            return sigar.getUptime().getUptime();
        } catch (SigarException e) {
            return -1;
        }
    }


    protected void gatherSystemInfo() {
        sysInfo = new SysInfo();
        try {
            sysInfo.gather(sigar);
        } catch (SigarException e) {
            e.printStackTrace();
        }
    }


    protected Object getOSType() {
        String name = "unknown";
        name = sysInfo.getName();
        if (osNames.get(name) != null) {
            return osNames.get(name);
        }
        return name;
    }


    protected Object getLoadAverage() {
        DynArray results = new DynArray(globalObject);
        try {
            double[] rawResults;
            rawResults = sigar.getLoadAverage();
            results.put(null, "0", rawResults[0], false);
            results.put(null, "1", rawResults[1], false);
            results.put(null, "2", rawResults[2], false);
        } catch (SigarException e) {
            e.printStackTrace();
        }
        return results;
    }


    protected Object getFreeMemory() {
        try {
            return sigar.getMem().getFree();
        } catch (SigarException e) {
            e.printStackTrace();
            return -1;
        }
    }


    protected Object getOSRelease() {
        // TODO: This actually returns OSX version number
        // vs. the Darwin version on OSX
        return sysInfo.getVendorVersion();
    }
}