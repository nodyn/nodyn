package org.projectodd.nodej.bindings.fs.stats;

import org.dynjs.runtime.AbstractNativeFunction;
import org.dynjs.runtime.ExecutionContext;
import org.dynjs.runtime.GlobalObject;

public class IsDirectory extends AbstractNativeFunction {
    
    public IsDirectory(GlobalObject globalObject) {
        super(globalObject);
    }

    @Override
    public Object call(ExecutionContext context, Object self, Object... args) {
        return false;
    }

}
