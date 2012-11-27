package org.projectodd.nodej.bindings.os;

import org.dynjs.runtime.AbstractNativeFunction;
import org.dynjs.runtime.GlobalObject;
import org.dynjs.runtime.LexicalEnvironment;
import org.hyperic.sigar.Sigar;

public abstract class OsFunctionBinding extends AbstractNativeFunction {

    protected GlobalObject globalObject;
    protected Sigar sigar = new Sigar();

    public OsFunctionBinding(GlobalObject globalObject) {
        super(globalObject);
        this.globalObject = globalObject;
    }
}