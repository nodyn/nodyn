package org.projectodd.nodej.bindings.fs;

import org.dynjs.runtime.ExecutionContext;
import org.dynjs.runtime.GlobalObject;
import org.dynjs.runtime.JSObject;
import org.dynjs.runtime.builtins.types.AbstractBuiltinType;

public class Stats extends AbstractBuiltinType {

    public Stats(GlobalObject globalObject) {
        super(globalObject);
    }

    @Override
    public Object call(ExecutionContext context, Object self, Object... args) {
        return null;
    }

    @Override
    public void initialize(GlobalObject globalObject, JSObject prototype) {
    }
}
