package org.projectodd.nodyn.bindings.buffer.prototype;

import java.io.UnsupportedEncodingException;

import org.dynjs.runtime.AbstractNativeFunction;
import org.dynjs.runtime.ExecutionContext;
import org.dynjs.runtime.GlobalObject;
import org.dynjs.runtime.Types;
import org.projectodd.nodyn.bindings.buffer.Buffer;

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
            Number value = 0;
            if (args[0] instanceof String) {
                try {
                    value = ((String)args[0]).getBytes("UTF-8")[0];
                } catch (UnsupportedEncodingException e) {
                    e.printStackTrace();
                }
            } else {
                value = Types.toNumber(context, args[0]);
            }
            if (Double.isNaN(start.doubleValue())) {
                start = 0;
            }
            if (Double.isNaN(end.doubleValue())) {
                end = buffer.getLength();
            }
            buffer.fill(value.byteValue(), start.intValue(), end.intValue());
        }
        String string = Types.toString(context, args[0]);
        return string.getBytes().length;
    }

}
