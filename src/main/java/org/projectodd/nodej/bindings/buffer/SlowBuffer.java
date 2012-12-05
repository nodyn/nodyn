package org.projectodd.nodej.bindings.buffer;

import org.dynjs.runtime.AbstractNativeFunction;
import org.dynjs.runtime.DynObject;
import org.dynjs.runtime.ExecutionContext;
import org.dynjs.runtime.GlobalObject;

public class SlowBuffer extends AbstractNativeFunction {
    
    public SlowBuffer(GlobalObject globalObject) {
        super(globalObject);
        setClassName("SlowBuffer");
        DynObject prototype = new DynObject(globalObject);
        setPrototype(prototype);
        prototype.defineReadOnlyProperty(globalObject, "byteLength", new ByteLength(globalObject));
    }

    @Override
    public Object call(ExecutionContext context, Object self, Object... args) {
        return self;
    }
}
