package org.projectodd.nodej.bindings.os;

import org.dynjs.runtime.DynArray;
import org.dynjs.runtime.ExecutionContext;
import org.dynjs.runtime.GlobalObject;
import org.hyperic.sigar.SigarException;

public class GetLoadAvg extends OsFunctionBinding {

    public GetLoadAvg(GlobalObject globalObject) {
        super(globalObject);
    }

    @Override
    public Object call(ExecutionContext context, Object self, Object... args) {
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
}