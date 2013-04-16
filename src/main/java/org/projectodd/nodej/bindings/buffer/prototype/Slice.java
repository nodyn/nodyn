package org.projectodd.nodej.bindings.buffer.prototype;

import org.dynjs.runtime.AbstractNativeFunction;
import org.dynjs.runtime.ExecutionContext;
import org.dynjs.runtime.GlobalObject;
import org.dynjs.runtime.Types;
import org.projectodd.nodej.bindings.buffer.Buffer;
import org.projectodd.nodej.bindings.buffer.Buffer.Encoding;

public class Slice extends AbstractNativeFunction {
    
    @SuppressWarnings("unused")
    private Encoding encoding;

    public Slice(GlobalObject global, Buffer.Encoding encoding) {
        super(global, "[start], [end]");
        this.encoding = encoding;
    }

    @Override
    public Object call(ExecutionContext context, Object self, Object... args) {
        Buffer buffer  = (Buffer) self;
        int start = Types.toUint32(context, args[0]).intValue();
        int end   = (int) buffer.getLength();
        if (args[1] != Types.UNDEFINED) {
            end = Types.toUint32(context, args[1]).intValue();
        }
        return buffer.slice(start, end);
    }

}
