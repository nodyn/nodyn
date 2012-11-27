package org.projectodd.nodej.bindings.os;

import org.dynjs.runtime.ExecutionContext;
import org.dynjs.runtime.GlobalObject;
import org.hyperic.sigar.SigarException;

public class GetUptime extends OsFunctionBinding {
    public GetUptime(GlobalObject globalObject) {
        super(globalObject);
    }

    @Override
    public Object call(ExecutionContext context, Object self, Object... args) {
        try {
            return sigar.getUptime().getUptime();
        } catch (SigarException e) {
            return -1;
        }
    }
}