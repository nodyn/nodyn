package org.projectodd.nodej;

import org.dynjs.runtime.DynJS;
import org.dynjs.runtime.ExecutionContext;
import org.dynjs.runtime.GlobalObject;
import org.dynjs.runtime.GlobalObjectFactory;

public class Node {

    public static final String VERSION = "0.1.0";
    private String[] args;

    public Node(String... args) {
        this.args = args;
    }

    public void start(ExecutionContext executionContext) {
        executionContext.getConfig().setGlobalObjectFactory(new GlobalObjectFactory() {
            @Override
            public GlobalObject newGlobalObject(DynJS runtime) {
                final GlobalObject globalObject = new GlobalObject(runtime);
                globalObject.defineGlobalProperty("process", new Process(globalObject, Node.this.args));
                return globalObject;
            }
        });
    }

}
