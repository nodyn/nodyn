package org.projectodd.nodej.bindings.buffer;

import org.dynjs.exception.ThrowException;
import org.dynjs.runtime.AbstractNativeFunction;
import org.dynjs.runtime.ExecutionContext;
import org.dynjs.runtime.GlobalObject;
import org.dynjs.runtime.Types;

public class ByteLength extends AbstractNativeFunction {
    
    public ByteLength(GlobalObject globalObject) {
        super(globalObject, "string", "encoding");
    }

    @Override
    public Object call(ExecutionContext context, Object self, Object... args) {
        if (!(args[0] instanceof String)) {
            throw new ThrowException(context, context.createTypeError("Argument must be a string."));
        }
        String string = Types.toString(context, args[0]);
        return string.getBytes().length;
    }

}
