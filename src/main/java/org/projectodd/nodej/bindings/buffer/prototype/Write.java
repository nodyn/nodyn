package org.projectodd.nodej.bindings.buffer.prototype;

import org.dynjs.exception.ThrowException;
import org.dynjs.runtime.AbstractNativeFunction;
import org.dynjs.runtime.ExecutionContext;
import org.dynjs.runtime.GlobalObject;
import org.dynjs.runtime.Types;
import org.projectodd.nodej.bindings.buffer.Buffer;

public class Write extends AbstractNativeFunction {
    private final Buffer.Encoding encoding;
    
    public Write(GlobalObject globalObject, Buffer.Encoding encoding) {
        super(globalObject, "string", "offset", "[maxLength]", "[encoding]");
        this.encoding = encoding;
    }

    @Override
    public Object call(ExecutionContext context, Object self, Object... args) {
        if (!(args[0] instanceof String)) {
            throw new ThrowException(context, context.createTypeError("Argument should be a String."));
        }
        String string  = (String)args[0];
        Buffer buffer  = (Buffer)self;
        Long offset    = Types.toUint32(context, args[1]);
        int maxLength  = string.length();
        if (args[2] != Types.UNDEFINED) {
            maxLength = Types.toUint32(context, args[2]).intValue();
        }
        return buffer.write(string, this.encoding, offset.intValue(), maxLength);
    }

}
