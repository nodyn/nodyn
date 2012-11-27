package org.projectodd.nodej.bindings.os;

import org.dynjs.runtime.ExecutionContext;
import org.dynjs.runtime.GlobalObject;
import org.hyperic.sigar.Mem;
import org.hyperic.sigar.SigarException;

public class GetTotalMem extends OsFunctionBinding {

    public GetTotalMem(GlobalObject globalObject) {
        super(globalObject);
    }

    @Override
    public Object call(ExecutionContext context, Object self, Object... args) {
            try {
                return sigar.getMem().getTotal();
            } catch (SigarException e) {
                e.printStackTrace();
                return -1;
            }
    }
}