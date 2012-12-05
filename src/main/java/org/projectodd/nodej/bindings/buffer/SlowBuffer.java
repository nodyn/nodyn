package org.projectodd.nodej.bindings.buffer;

import org.dynjs.runtime.AbstractNativeFunction;
import org.dynjs.runtime.DynObject;
import org.dynjs.runtime.ExecutionContext;
import org.dynjs.runtime.GlobalObject;
import org.dynjs.runtime.PropertyDescriptor;

public class SlowBuffer extends AbstractNativeFunction {
    
    public SlowBuffer(GlobalObject globalObject) {
        super(globalObject);
        setClassName("SlowBuffer");
        final DynObject prototype = new DynObject(globalObject);
        prototype.defineReadOnlyProperty(globalObject, "byteLength", new ByteLength(globalObject));
        defineOwnProperty(null, "prototype", new PropertyDescriptor() {
            {
                set("Value", prototype);
                set("Writable", false);
                set("Configurable", false);
                set("Enumerable", false);
            }
        }, false);
        setPrototype(prototype);
    }

    @Override
    public Object call(ExecutionContext context, Object self, Object... args) {
        return self;
    }
}
