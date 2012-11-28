package org.projectodd.nodej.bindings.os;


import org.dynjs.runtime.ExecutionContext;
import org.dynjs.runtime.GlobalObject;

public class GetInterfaceAddresses extends OsFunctionBinding {
    
    public GetInterfaceAddresses(GlobalObject globalObject) {
        super(globalObject);
    }

    @Override
    public Object call(ExecutionContext context, Object self, Object... args) {
        return getInterfaceAddresses();
    }
}