package org.projectodd.nodej.bindings.console;

import java.io.PrintStream;

import org.dynjs.exception.ThrowException;
import org.dynjs.runtime.AbstractNativeFunction;
import org.dynjs.runtime.DynObject;
import org.dynjs.runtime.ExecutionContext;
import org.dynjs.runtime.GlobalObject;

import org.projectodd.nodej.bindings.Binding;

public class Logger extends DynObject {

    private PrintStream output;
    private PrintStream error;

    public Logger(final GlobalObject globalObject) {
        super(globalObject);
        this.output = globalObject.getConfig().getOutputStream();
        this.error  = globalObject.getConfig().getErrorStream();
        
        Binding.setProperty(this, "out", new AbstractNativeFunction(globalObject) {
            @Override
            public Object call(ExecutionContext context, Object self, Object... args) {
                // TODO: Make this async
                output.println(args[0].toString());
                return null;
            }
        });
        Binding.setProperty(this, "err", new AbstractNativeFunction(globalObject) {
            @Override
            public Object call(ExecutionContext context, Object self, Object... args) {
                // TODO: Make this async
                error.println(args[0].toString());
                return null;
            }
        });
        Binding.setProperty(this, "trace", new AbstractNativeFunction(globalObject) {
            @Override
            public Object call(ExecutionContext context, Object self, Object... args) {
                // TODO: Make this async
                ThrowException e = new ThrowException(context, args[0]);
                e.printStackTrace();
                return null;
            }
        });
    }

}
