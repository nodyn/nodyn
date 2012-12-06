package org.projectodd.nodej.bindings.buffer.prototype;

import org.dynjs.exception.ThrowException;
import org.dynjs.runtime.AbstractNativeFunction;
import org.dynjs.runtime.ExecutionContext;
import org.dynjs.runtime.GlobalObject;
import org.dynjs.runtime.Types;
import org.projectodd.nodej.bindings.buffer.Buffer;

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
        int targetStart  = Types.toUint32(context, args[1]).intValue();
        int sourceStart  = Types.toUint32(context, args[2]).intValue();
        int sourceEnd    = Types.toUint32(context, args[3]).intValue();
        if (args[3] == Types.UNDEFINED) {
            sourceEnd = ((Long) source.get(context, "length")).intValue();
        }
        return target.copy(source.getBuffer(), targetStart, sourceStart, sourceEnd);
    }

}
