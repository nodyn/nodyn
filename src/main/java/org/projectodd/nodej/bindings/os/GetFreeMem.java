package org.projectodd.nodej.bindings.os;

import org.dynjs.runtime.ExecutionContext;
import org.dynjs.runtime.GlobalObject;
import org.hyperic.sigar.SigarException;

public class GetFreeMem extends OsFunctionBinding {
    
    public GetFreeMem(GlobalObject globalObject) {
        super(globalObject);
    }

    @Override
    public Object call(ExecutionContext context, Object self, Object... args) {
        try {
            return sigar.getMem().getFree();
        } catch (SigarException e) {
            e.printStackTrace();
            return -1;
        }
    }
}