package org.projectodd.nodej.bindings.timers;

import org.dynjs.runtime.AbstractNativeFunction;
import org.dynjs.runtime.ExecutionContext;
import org.dynjs.runtime.GlobalObject;
import org.dynjs.runtime.LexicalEnvironment;
import org.dynjs.runtime.Types;

public class ClearTimeout extends AbstractNativeFunction {

    public ClearTimeout(GlobalObject globalObject) {
        super(globalObject, "timeoutId");
    }

    @Override
    public Object call(ExecutionContext context, Object self, Object... args) {
        if (args[0] != Types.UNDEFINED) {
            long id = Types.toInt32(context, args[0]).longValue();
            Timer timer = Timer.TIMERS.get(id);
            if (timer != null) {
                timer.interrupt();
            }
        }
        return null;
    }

}
