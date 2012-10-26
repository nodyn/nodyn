package org.projectodd.nodej;

import org.dynjs.Config;
import org.dynjs.runtime.DynJS;
import org.dynjs.runtime.GlobalObject;
import org.dynjs.runtime.GlobalObjectFactory;

public class Node {

    public static final String VERSION = "0.1.0";
    private DynJS runtime;
    private String[] args;

    public Node(String... args) {
        this.args = args;
        Config config = new Config();
        config.setGlobalObjectFactory(new GlobalObjectFactory() {
            @Override
            public GlobalObject newGlobalObject(DynJS runtime) {
                final GlobalObject globalObject = new GlobalObject(runtime);
                globalObject.defineGlobalProperty("process", new Process(globalObject, Node.this.args));
                return globalObject;
            }
        });
        this.runtime = new DynJS(config);
    }

    public void start() {
        // Start event processing
    }
    
    // I'm not sure if we really want to expose this or not. 
    // At the moment, it's being used for testing
    public DynJS getRuntime() {
        return this.runtime;
    }

}
