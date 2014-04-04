package org.projectodd.nodyn.buffer.prototype;

import org.dynjs.runtime.AbstractNativeFunction;
import org.dynjs.runtime.ExecutionContext;
import org.dynjs.runtime.GlobalObject;
import org.dynjs.runtime.Types;
import org.projectodd.nodyn.buffer.Buffer;
import org.projectodd.nodyn.buffer.BufferType;

public class ToString extends AbstractNativeFunction {
    
    public ToString(GlobalObject globalObject) {
        super(globalObject);
    }

    @Override
    public Object call(ExecutionContext context, Object self, Object... args) {
        if (args.length > 0) {
            String encoding = Types.toString(context, args[0]);
            return ((Buffer) self).toString(BufferType.getEncoding(encoding));
        } else {
            return self.toString().trim();
        }
    }
}
