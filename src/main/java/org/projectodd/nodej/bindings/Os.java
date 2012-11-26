package org.projectodd.nodej.bindings;

import org.dynjs.runtime.DynObject;
import org.dynjs.runtime.GlobalObject;

public class Os extends DynObject {

    public Os(GlobalObject globalObject) {
        super(globalObject);
        // TODO: This is not for real
        Binding.setProperty(this, "getHostname", "localhost");
    }
}
