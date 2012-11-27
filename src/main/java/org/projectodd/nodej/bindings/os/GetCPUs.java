package org.projectodd.nodej.bindings.os;

import org.dynjs.runtime.ExecutionContext;
import org.dynjs.runtime.GlobalObject;
import org.hyperic.sigar.CpuInfo;

public class GetCPUs extends OsFunctionBinding {
    public GetCPUs(GlobalObject globalObject) {
        super(globalObject);
    }

    @Override
    public Object call(ExecutionContext context, Object self, Object... args) {
        CpuInfo cpu = new CpuInfo();
        return cpu.getModel();
    }
}