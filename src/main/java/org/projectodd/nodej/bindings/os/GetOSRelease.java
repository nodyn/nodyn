package org.projectodd.nodej.bindings.os;


import org.dynjs.runtime.ExecutionContext;
import org.dynjs.runtime.GlobalObject;

public class GetOSRelease extends OsFunctionBinding {
    
    public GetOSRelease(GlobalObject globalObject) {
        super(globalObject);
        gatherSystemInfo();
    }

    @Override
    public Object call(ExecutionContext context, Object self, Object... args) {
        return getOSRelease();
    }
}