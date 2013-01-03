package org.projectodd.nodej.bindings;

import java.nio.file.AccessMode;
import java.nio.file.StandardOpenOption;

import org.dynjs.runtime.DynObject;
import org.dynjs.runtime.GlobalObject;

public class Constants extends DynObject {

    public Constants(GlobalObject globalObject) {
        super(globalObject);
        // File access modes
        Binding.setProperty(this, "O_RDONLY", AccessMode.READ);
        Binding.setProperty(this, "O_WRONLY", AccessMode.WRITE); // hmm
        Binding.setProperty(this, "O_RDWR",   AccessMode.WRITE);
        
        Binding.setProperty(this, "O_APPEND", StandardOpenOption.APPEND);
        
        // stubs
        Binding.setProperty(this, "S_IMFT", 0);
    }
}
