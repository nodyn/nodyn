package org.projectodd.nodej.bindings;

import org.dynjs.runtime.DynObject;
import org.dynjs.runtime.GlobalObject;
import org.projectodd.nodej.bindings.buffer.SlowBuffer;

public class Buffer extends DynObject {
    public Buffer(GlobalObject globalObject) {
        super(globalObject);
        Binding.setProperty(this, "SlowBuffer", new SlowBuffer(globalObject));
    }
}
