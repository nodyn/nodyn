package org.projectodd.nodej;

import java.io.FileNotFoundException;

import org.dynjs.runtime.DynJS;
import org.dynjs.runtime.GlobalObject;
import org.dynjs.runtime.GlobalObjectFactory;
import org.dynjs.vertx.DynJSVerticleFactory;
import org.vertx.java.platform.Verticle;

public class NodeJSVerticleFactory extends DynJSVerticleFactory {
    private GlobalObjectFactory globalObjectFactory;
    
    @Override
    public Verticle createVerticle(String main) throws Exception {
        initializeRootContext();
        try {
            loadScript(getExecutionContext(), "node.js");
            new Node(getExecutionContext());
        } catch (FileNotFoundException e) {
            System.err.println("Cannot initialize NodeJ");
            e.printStackTrace();
        }
        return new DynJSVerticle(main);
    }
    
    @Override
    public GlobalObjectFactory getGlobalObjectFactory() {
        if (this.globalObjectFactory == null) {
            this.globalObjectFactory = new NodeJSGlobalObjectFactory();
        }
        return this.globalObjectFactory;
    }

    private class NodeJSGlobalObjectFactory extends DynJSGlobalObjectFactory {
        @Override
        public GlobalObject newGlobalObject(final DynJS runtime) {
            GlobalObject global = super.newGlobalObject(runtime);
            global.defineGlobalProperty("process", new Process(global, null));
            global.defineGlobalProperty("Buffer", "foo");
            return global;
        }
    }
    
}
