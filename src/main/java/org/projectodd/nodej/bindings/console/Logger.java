package org.projectodd.nodej.bindings.console;

import java.io.PrintStream;

import org.dynjs.exception.ThrowException;
import org.dynjs.runtime.AbstractNativeFunction;
import org.dynjs.runtime.DynObject;
import org.dynjs.runtime.ExecutionContext;
import org.dynjs.runtime.GlobalObject;
import org.dynjs.runtime.PropertyDescriptor;

public class Logger extends DynObject {

    private PrintStream output;
    private PrintStream error;

    public Logger(final GlobalObject globalObject) {
        super(globalObject);
        this.output = globalObject.getConfig().getOutputStream();
        this.error  = globalObject.getConfig().getErrorStream();
        
        this.defineOwnProperty(null, "out", new PropertyDescriptor() {
            {
                set("Value", new AbstractNativeFunction(globalObject) {
                            @Override
                            public Object call(ExecutionContext context, Object self, Object... args) {
                                // TODO: Make this async
                                output.println(args[0].toString());
                                return null;
                            }
                        } );
                set("Writable", false);
                set("Enumerable", true);
                set("Configurable", false);
            }
        }, false);
        this.defineOwnProperty(null, "err", new PropertyDescriptor() {
            {
                set("Value", new AbstractNativeFunction(globalObject) {
                            @Override
                            public Object call(ExecutionContext context, Object self, Object... args) {
                                // TODO: Make this async
                                error.println(args[0].toString());
                                return null;
                            }
                        } );
                set("Writable", false);
                set("Enumerable", true);
                set("Configurable", false);
            }
        }, false);
        this.defineOwnProperty(null, "trace", new PropertyDescriptor() {
            {
                set("Value", new AbstractNativeFunction(globalObject) {
                            @Override
                            public Object call(ExecutionContext context, Object self, Object... args) {
                                // TODO: Make this async
                                ThrowException e = new ThrowException(context, args[0]);
                                e.printStackTrace();
                                return null;
                            }
                        } );
                set("Writable", false);
                set("Enumerable", true);
                set("Configurable", false);
            }
        }, false);
    }

}
