package org.projectodd.nodej.bindings.buffer;

import org.dynjs.runtime.AbstractNativeFunction;
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
        return Types.UNDEFINED;
    }
}