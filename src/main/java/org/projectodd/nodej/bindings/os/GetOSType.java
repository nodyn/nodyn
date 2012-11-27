package org.projectodd.nodej.bindings.os;

import java.util.HashMap;
import java.util.Map;

import org.dynjs.runtime.ExecutionContext;
import org.dynjs.runtime.GlobalObject;
import org.hyperic.sigar.SigarException;
import org.hyperic.sigar.SysInfo;

public class GetOSType extends OsFunctionBinding {
    
    private static Map<String, String> names = new HashMap<String, String>();
    private SysInfo sysInfo;
    static {
        names.put("MacOSX", "Darwin");
    }
    
    public GetOSType(GlobalObject globalObject) {
        super(globalObject);
        sysInfo = new SysInfo();
        try {
            sysInfo.gather(sigar);
        } catch (SigarException e) {
            e.printStackTrace();
        }
    }

    @Override
    public Object call(ExecutionContext context, Object self, Object... args) {
        String name = "unknown";
        name = sysInfo.getName();
        if (names.get(name) != null) {
            return names.get(name);
        }
        return name;
    }
}