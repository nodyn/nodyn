package org.projectodd.nodej.bindings;

import org.dynjs.runtime.DynObject;
import org.dynjs.runtime.GlobalObject;
import org.projectodd.nodej.bindings.fs.Stats;

public class Fs extends DynObject {

    public Fs(GlobalObject globalObject) {
        super(globalObject);
        Binding.setProperty(this, "Stats", new Stats(globalObject));
    }

}
