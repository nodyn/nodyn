package org.projectodd.nodej.bindings;

import java.net.UnknownHostException;

import org.dynjs.runtime.AbstractNativeFunction;
import org.dynjs.runtime.DynObject;
import org.dynjs.runtime.ExecutionContext;
import org.dynjs.runtime.GlobalObject;

public class Os extends DynObject {

    public Os(GlobalObject globalObject) {
        super(globalObject);
        Binding.setProperty(this, "getHostname", new AbstractNativeFunction(globalObject) {
            @Override
            public Object call(ExecutionContext context, Object self, Object... args) {
                try {
                    return java.net.InetAddress.getLocalHost().getHostName();
                } catch (UnknownHostException e) {
                    return "unknown host";
                }
            }
            
        });
    }
    
    
}
