package org.projectodd.nodej.bindings;

import java.util.HashMap;
import java.util.Map;

import org.dynjs.runtime.AbstractNativeFunction;
import org.dynjs.runtime.DynObject;
import org.dynjs.runtime.ExecutionContext;
import org.dynjs.runtime.GlobalObject;
import org.dynjs.runtime.PropertyDescriptor;
import org.projectodd.nodej.bindings.console.Logger;

public class Binding extends AbstractNativeFunction {

    private Map<String, DynObject> bindings = new HashMap<String, DynObject>();
    
    public Binding(GlobalObject globalObject) {
        super(globalObject);
        bindings.put("buffer", new Buffer(globalObject));
        bindings.put("constants", new Constants(globalObject));
        bindings.put("logger", new Logger(globalObject));
        bindings.put("QueryString", new QueryString(globalObject));
    }

    public static void setProperty(DynObject __this, String name, final Object value) {
        __this.defineOwnProperty(null, name, new PropertyDescriptor() {
            {
                set("Value", value );
                set("Writable", false);
                set("Enumerable", true);
                set("Configurable", false);
            }
        }, false);
    }

    @Override
    public Object call(ExecutionContext context, Object self, Object... args) {
        if (args[0] instanceof String) {
            return bindings.get(args[0]);
        }
        return null;
    }
    
}
