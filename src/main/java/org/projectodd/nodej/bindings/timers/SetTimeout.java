package org.projectodd.nodej.bindings.timers;

import org.dynjs.runtime.AbstractNativeFunction;
import org.dynjs.runtime.ExecutionContext;
import org.dynjs.runtime.GlobalObject;
import org.dynjs.runtime.JSFunction;
import org.dynjs.runtime.Types;
import org.projectodd.nodej.Node;

public class SetTimeout extends AbstractNativeFunction {
    boolean repeat = false;
    
    public SetTimeout(GlobalObject globalObject, boolean repeat) {
        super(globalObject, "callback", "delay", "[arg]", "[...]");
        this.repeat = repeat;
    }

    @Override
    public Object call(ExecutionContext context, Object self, Object... args) {
        if (args[0] instanceof JSFunction) {
            JSFunction func = (JSFunction) args[0];
            int timeout = Types.toInteger(context, args[1]).intValue();
            Object[] functionArgs = null;
            if (args.length > 2) {
                functionArgs = new Object[args.length-2];
                for(int i=2; i<args.length; ++i) { functionArgs[i-2] = args[i]; }
            }
            return Node.dispatchAt(context, timeout, repeat, func, functionArgs);
        } else {
            System.err.println("usage: setTimeout(callback, delay, [arg], [...])");
        }
        return -1;
    }
}
