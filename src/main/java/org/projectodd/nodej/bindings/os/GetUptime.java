package org.projectodd.nodej.bindings.os;

import org.dynjs.runtime.ExecutionContext;
import org.dynjs.runtime.GlobalObject;

public class GetUptime extends OsFunctionBinding {
    public GetUptime(GlobalObject globalObject) {
        super(globalObject);
    }

    @Override
    public Object call(ExecutionContext context, Object self, Object... args) {
        return getUptime();
    }
}