package org.projectodd.nodyn;

import org.dynjs.runtime.DynObject;
import org.dynjs.runtime.GlobalObject;

public class Versions extends DynObject {
    
    public Versions(GlobalObject globalObject) {
        super(globalObject);
        this.put(null, "node", org.projectodd.nodyn.Node.VERSION, false);
        this.put(null, "java", System.getProperty("java.version"), false);
        this.put(null, "dynjs", org.dynjs.runtime.DynJS.VERSION, false);
    }
}
