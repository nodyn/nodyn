package org.projectodd.nodej.bindings;

import org.dynjs.runtime.AbstractNativeFunction;
import org.dynjs.runtime.DynObject;
import org.dynjs.runtime.ExecutionContext;
import org.dynjs.runtime.GlobalObject;
import org.dynjs.runtime.JSFunction;
import org.projectodd.nodej.Node;

public class Dispatcher extends DynObject {
    
    public Dispatcher(GlobalObject globalObject) {
        super(globalObject);
        
        Binding.setProperty(this, "submit", new AbstractNativeFunction(globalObject) {
            @Override
            public Object call(final ExecutionContext context, Object self, Object... args) {
                if (args[0] instanceof JSFunction) {
                    return Node.dispatch((JSFunction)args[0], context);
                } else {
                    System.err.println("Can't dispatch non-callable object");
                }
                return null;
            }
            
        });
    }
}
