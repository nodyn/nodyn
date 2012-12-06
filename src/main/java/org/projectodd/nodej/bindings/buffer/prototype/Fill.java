package org.projectodd.nodej.bindings.buffer.prototype;

import org.dynjs.runtime.AbstractNativeFunction;
import org.dynjs.runtime.ExecutionContext;
import org.dynjs.runtime.GlobalObject;
import org.dynjs.runtime.Types;
import org.projectodd.nodej.bindings.buffer.Buffer;

public class Fill extends AbstractNativeFunction {
    
    public Fill(GlobalObject globalObject) {
        super(globalObject, "value", "[offset]", "[end]");
    }

    @Override
    public Object call(ExecutionContext context, Object self, Object... args) {
        if (self instanceof Buffer) {
            Buffer buffer = (Buffer) self;
            Number start = Types.toNumber(context, args[1]);
            Number end   = Types.toNumber(context, args[2]);
            Number value = Types.toNumber(context, args[0]);
            buffer.fill(value.byteValue(), start.intValue(), end.intValue());
        }
        String string = Types.toString(context, args[0]);
        return string.getBytes().length;
    }

}
