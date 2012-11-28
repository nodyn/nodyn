package org.projectodd.nodej.bindings.os;

import java.util.HashMap;
import java.util.Map;

import org.dynjs.runtime.AbstractNativeFunction;
import org.dynjs.runtime.DynArray;
import org.dynjs.runtime.DynObject;
import org.dynjs.runtime.GlobalObject;
import org.hyperic.sigar.Cpu;
import org.hyperic.sigar.CpuInfo;
import org.hyperic.sigar.NetInterfaceConfig;
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
        this.sysInfo = new SysInfo();
        gatherSystemInfo();
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
        try {
            sysInfo.gather(sigar);
        } catch (SigarException e) {
            e.printStackTrace();
        }
    }

    protected Object getOSType() {
        String name = sysInfo.getName();
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
    
    protected Object getInterfaceAddresses() {
        DynObject rval = new DynObject(globalObject);
        try {
            String[] interfaceList = sigar.getNetInterfaceList();
            for (String iface : interfaceList) {
                DynArray interfaceInfo = new DynArray(globalObject);
                
                DynObject nextInterface   = new DynObject(globalObject);
                NetInterfaceConfig config = sigar.getNetInterfaceConfig(iface);
                nextInterface.put(null, "address", config.getDestination(), false);
                nextInterface.put(null, "family", "IPv4", false); // Sigar doesn't provide IPv6 info until version 1.7
                nextInterface.put(null, "internal", config.getType().contains("Local"), false);
                
                interfaceInfo.put(null, "0", nextInterface, false);
                
//                System.err.println(iface + ":");
//                System.err.println("\tdescription: " + config.getDescription());
//                System.err.println("\tdestination: " + config.getDestination());
//                System.err.println("\tflags: " + config.getFlags());
//                System.err.println("\thwaddr: " + config.getHwaddr());
//                System.err.println("\tname: " + config.getName());
//                System.err.println("\ttype: " + config.getType());
                rval.put(null, iface, interfaceInfo, false);
            }
        } catch (SigarException e) {
            e.printStackTrace();
        }
        return rval;
    }

    protected Object getCPUs() {
        DynArray rval = new DynArray(globalObject);
        CpuInfo[] cpuInfo;
        Cpu[] timings;
        try {
            int index = 0;
            cpuInfo = sigar.getCpuInfoList();
            timings = sigar.getCpuList();
            for (CpuInfo info : cpuInfo) {
                // Basic cpu info
                DynObject cpu = new DynObject(globalObject);
                cpu.put(null, "model", info.getModel(), false);
                cpu.put(null, "speed", info.getMhz(), false);
                
                // CPU utilization
                DynObject times = new DynObject(globalObject);
                times.put(null, "user", timings[index].getUser(), false);
                times.put(null, "nice", timings[index].getNice(), false);
                times.put(null, "sys", timings[index].getSys(), false);
                times.put(null, "idle", timings[index].getIdle(), false);
                times.put(null, "irq", timings[index].getIrq(), false);
                cpu.put(null, "times", times, false);
                
//                System.err.println("model: " + info.getModel());
//                System.err.println("user: " + timings[index].getUser());
//                System.err.println("nice: " + timings[index].getNice());
//                System.err.println("sys: " + timings[index].getSys());
//                System.err.println("idle: " + timings[index].getIdle());
//                System.err.println("irq: " + timings[index].getIrq());
                rval.put(null, ""+index, cpu, false);
                index++;
            }
        } catch (SigarException e) {
            e.printStackTrace();
        }

        return rval;
    }
}