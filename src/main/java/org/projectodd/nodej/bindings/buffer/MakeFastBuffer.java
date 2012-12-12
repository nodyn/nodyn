package org.projectodd.nodej.bindings.buffer;

import org.dynjs.runtime.AbstractNativeFunction;
import org.dynjs.runtime.DynObject;
import org.dynjs.runtime.ExecutionContext;
import org.dynjs.runtime.GlobalObject;
import org.dynjs.runtime.Types;

// Enables getting and setting properties
// https://github.com/joyent/node/blob/master/src/node_buffer.cc#L695
public class MakeFastBuffer extends AbstractNativeFunction {

    public MakeFastBuffer(GlobalObject globalObject) {
        super(globalObject);
    }

    @Override
    public Object call(ExecutionContext context, Object self, Object... args) {        
        DynObject buffer = (DynObject) args[0];
        DynObject fastBuffer = (DynObject) args[1];
        // TODO: Length and offset
        if (buffer instanceof Buffer) {
            Buffer _buf = (Buffer) buffer;
            fastBuffer.setBackingArray(_buf.getBackingArray());
        }
        return Types.UNDEFINED;
    }
}