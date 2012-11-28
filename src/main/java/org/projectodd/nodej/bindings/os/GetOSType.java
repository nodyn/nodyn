package org.projectodd.nodej.bindings.os;


import org.dynjs.runtime.ExecutionContext;
import org.dynjs.runtime.GlobalObject;

public class GetOSType extends OsFunctionBinding {
    
    public GetOSType(GlobalObject globalObject) {
        super(globalObject);
        gatherSystemInfo();
    }

    @Override
    public Object call(ExecutionContext context, Object self, Object... args) {
        return getOSType();
    }
}