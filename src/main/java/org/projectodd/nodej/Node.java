package org.projectodd.nodej;

import org.dynjs.runtime.ExecutionContext;
import org.dynjs.runtime.GlobalObject;
import org.projectodd.nodej.bindings.buffer.BufferType;

public class Node {

    public static final String VERSION = "0.1.0";
    private String filename = "<eval>";

    public Node(final ExecutionContext context) {
        GlobalObject globalObject = context.getGlobalObject();
        globalObject.defineGlobalProperty("Buffer", new BufferType(globalObject));
    }
    
    public String getDirname() {
        return System.getProperty("user.dir");
    }

    public String getFilename() {
        return this.filename;
    }

    public void setFilename(String filename) {
        this.filename = filename;
    }

}
