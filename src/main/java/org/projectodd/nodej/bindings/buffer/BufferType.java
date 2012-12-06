package org.projectodd.nodej.bindings.buffer;

import org.dynjs.runtime.AbstractNativeFunction;
import org.dynjs.runtime.DynObject;
import org.dynjs.runtime.ExecutionContext;
import org.dynjs.runtime.GlobalObject;
import org.dynjs.runtime.PropertyDescriptor;
import org.projectodd.nodej.bindings.buffer.prototype.ByteLength;

public class BufferType extends  AbstractNativeFunction { 
    public BufferType(GlobalObject globalObject) {
        super(globalObject);
        this.setClassName("SlowBuffer");
        final DynObject prototype = initializePrototype(globalObject);
        defineOwnProperty(null, "prototype", new PropertyDescriptor() {
            {
                set("Value", prototype);
                set("Writable", false);
                set("Configurable", false);
                set("Enumerable", false);
            }
        }, false);
        setPrototype(prototype);
    }

    @Override
    public Object call(ExecutionContext context, Object self, Object... args) {
        Buffer buffer = new Buffer(context.getGlobalObject(), (long) args[0]);
        buffer.setPrototype(this.getPrototype());
        return buffer;
    }
    
    private DynObject initializePrototype(GlobalObject globalObject) {
        final DynObject prototype = new DynObject(globalObject);
        prototype.defineReadOnlyProperty(globalObject, "byteLength", new ByteLength(globalObject));
        prototype.defineOwnProperty(null, "constructor", new PropertyDescriptor() {
            {
                set("Value", this);
                set("Writable", false);
                set("Configurable", false);
                set("Enumerable", true);
            }
        }, false);
        return prototype;
    }
    
}
