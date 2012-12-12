package org.projectodd.nodej.bindings.buffer;

import java.io.UnsupportedEncodingException;

import org.dynjs.exception.ThrowException;
import org.dynjs.runtime.AbstractNativeFunction;
import org.dynjs.runtime.DynArray;
import org.dynjs.runtime.DynObject;
import org.dynjs.runtime.ExecutionContext;
import org.dynjs.runtime.GlobalObject;
import org.dynjs.runtime.PropertyDescriptor;
import org.dynjs.runtime.Types;
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
        Buffer buffer;
        if (args[0] instanceof DynArray) {
            DynArray items = (DynArray) args[0];
            long length = Types.toUint32(context, items.get(context, "length"));
            buffer = new Buffer(context.getGlobalObject(), length);
            for(int i=0; i<length; i++) {
                buffer.write(Types.toString(context, items.get(context, "" + i)), Buffer.Encoding.UTF8, i, 1);
            }
        } else if (args[0] instanceof Number){
            buffer = new Buffer(context.getGlobalObject(), (long) args[0]);
        } else if (args[0] == Types.UNDEFINED || args[0] == Types.NULL) {
            throw new ThrowException(context, context.createTypeError("Bad argument"));
        } else {
            String str = Types.toString(context, args[0]);
            buffer = new Buffer(context.getGlobalObject(), str.length());
            try {
                buffer.copy(Buffer.getByteObjectArray(str, "UTF-8"), 0, 0, str.length());
            } catch (UnsupportedEncodingException e) {
                e.printStackTrace();
            }
        }
        buffer.setPrototype(this.getPrototype());
        return buffer;
    }
    
    private DynObject initializePrototype(GlobalObject globalObject) {
        final DynObject prototype = new DynObject(globalObject);
        prototype.defineReadOnlyProperty(globalObject, "byteLength", new ByteLength(globalObject));
        prototype.defineReadOnlyProperty(globalObject, "makeFastBuffer", new MakeFastBuffer(globalObject));
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
