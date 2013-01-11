package org.projectodd.nodej;

import org.dynjs.runtime.DynObject;
import org.dynjs.runtime.ExecutionContext;
import org.dynjs.runtime.GlobalObject;
import org.dynjs.runtime.PropertyDescriptor;

public class Versions extends DynObject {
    
    public Versions(GlobalObject globalObject) {
        super(globalObject);
        this.put(null, "node", org.projectodd.nodej.Node.VERSION, false);
        this.put(null, "java", System.getProperty("java.version"), false);
        this.put(null, "dynjs", org.dynjs.DynJSVersion.FULL, false);
    }
}
