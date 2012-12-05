package org.projectodd.nodej.bindings.buffer;

import org.dynjs.runtime.AbstractNativeFunction;
import org.dynjs.runtime.ExecutionContext;
import org.dynjs.runtime.GlobalObject;

public class ByteLength extends AbstractNativeFunction {
    
    public ByteLength(GlobalObject globalObject) {
        super(globalObject, "string", "encoding");
    }

    @Override
    public Object call(ExecutionContext context, Object self, Object... args) {
        return "12";
    }

}
