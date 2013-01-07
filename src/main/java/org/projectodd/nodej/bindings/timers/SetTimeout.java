package org.projectodd.nodej.bindings.timers;

import org.dynjs.runtime.AbstractNativeFunction;
import org.dynjs.runtime.ExecutionContext;
import org.dynjs.runtime.GlobalObject;
import org.dynjs.runtime.JSFunction;
import org.dynjs.runtime.Types;

public class SetTimeout extends AbstractNativeFunction {
    
    public SetTimeout(GlobalObject globalObject) {
        super(globalObject, "callback", "delay", "[arg]", "[...]");
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
            new Runner(func, context, timeout, functionArgs).start();
        } else {
            System.err.println("usage: setTimeout(callback, delay, [arg], [...])");
        }
        return 1;
    }

    private class Runner extends Thread {
        private ExecutionContext context;
        private JSFunction func;
        private int timeout;
        private Object[] args;
        
        public Runner(JSFunction func, ExecutionContext context, int timeout, Object...args) {
            this.func    = func;
            this.args    = args;
            this.context = context;
            this.timeout = timeout;
        }
        public void run() {
            try {
                Thread.sleep(timeout);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
            context.call(func, null, args);
        }
    }
}
