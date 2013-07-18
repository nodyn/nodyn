package org.projectodd.nodyn.buffer.prototype;

import org.dynjs.exception.ThrowException;
import org.dynjs.runtime.AbstractNativeFunction;
import org.dynjs.runtime.ExecutionContext;
import org.dynjs.runtime.GlobalObject;
import org.projectodd.nodyn.buffer.Buffer;

public class Copy extends AbstractNativeFunction {
    
    public Copy(GlobalObject globalObject) {
        super(globalObject, "target", "targetStart", "sourceStart", "sourceEnd");
    }

    @Override
    public Object call(ExecutionContext context, Object self, Object... args) {
        if (!(args[0] instanceof Buffer)) {
            throw new ThrowException(context, context.createTypeError("First arg should be a Buffer."));
        }
        Buffer source = (Buffer) self;
        Buffer target = (Buffer) args[0];
        int targetStart  = 0; 
        int sourceStart  = 0; 
        int sourceEnd    = (int) source.toString().getBytes().length; // totally stupid
        if (args[1] instanceof Number) {
            targetStart = ((Number)args[1]).intValue();
        }
        if (args[2] instanceof Number) {
            sourceStart = ((Number)args[2]).intValue();
        }
        if (args[3] instanceof Number) {
            sourceEnd = ((Number)args[3]).intValue();
        }
        return target.copy(source, targetStart, sourceStart, sourceEnd);
    }

}
