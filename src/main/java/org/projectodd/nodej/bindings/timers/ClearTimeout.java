package org.projectodd.nodej.bindings.timers;

import java.util.concurrent.Future;

import org.dynjs.runtime.AbstractNativeFunction;
import org.dynjs.runtime.ExecutionContext;
import org.dynjs.runtime.GlobalObject;

public class ClearTimeout extends AbstractNativeFunction {

    public ClearTimeout(GlobalObject globalObject) {
        super(globalObject, "timeoutId");
    }

    @Override
    public Object call(ExecutionContext context, Object self, Object... args) {
        if (args[0] instanceof Future) {
            @SuppressWarnings("unchecked")
            Future<Object> future = (Future<Object>) args[0];
            return future.cancel(false);
        }
        return false;
    }

}
