package org.projectodd.nodej.bindings.buffer;

import org.dynjs.runtime.ExecutionContext;
import org.dynjs.runtime.GlobalObject;
import org.dynjs.runtime.JSObject;
import org.dynjs.runtime.builtins.types.AbstractBuiltinType;
import org.dynjs.runtime.builtins.types.function.prototype.ToString;

public class SlowBuffer extends AbstractBuiltinType {
    
    public SlowBuffer(GlobalObject globalObject) {
        super(globalObject);
        setClassName("SlowBuffer");
        setPrototypeProperty(globalObject.getPrototypeFor("Object"));
    }

    @Override
    public void initialize(GlobalObject globalObject, JSObject prototype) {
        defineNonEnumerableProperty(prototype, "constructor", this);
        defineNonEnumerableProperty(prototype, "toString", new ToString(globalObject));
    }

    @Override
    public Object call(ExecutionContext context, Object self, Object... args) {
        return this;
    }
    
    @Override
    public JSObject createNewObject(ExecutionContext context) {
        return this;
    }
}
