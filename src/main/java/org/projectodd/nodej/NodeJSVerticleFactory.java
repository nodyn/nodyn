package org.projectodd.nodej;

import java.io.FileNotFoundException;

import org.dynjs.runtime.DynJS;
import org.dynjs.runtime.ExecutionContext;
import org.dynjs.runtime.GlobalObject;
import org.dynjs.vertx.DynJSVerticleFactory;
import org.vertx.java.core.Vertx;
import org.vertx.java.platform.Container;

public class NodeJSVerticleFactory extends DynJSVerticleFactory {
    
    @Override
    public void init(Vertx vertx, Container container, ClassLoader classloader) {
        super.init(vertx, container, classloader);
        DynJS runtime = this.getRuntime();
        runtime.getConfig().setGlobalObjectFactory(new NodeJSGlobalObjectFactory(runtime));
        try {
            loadScript(getRootContext(runtime), "node.js");
        } catch (FileNotFoundException e) {
            System.err.println("Cannot initialize NodeJ");
            e.printStackTrace();
        }
    }

    private ExecutionContext getRootContext(final DynJS runtime) {
        ExecutionContext context = runtime.getExecutionContext();
        ExecutionContext parent = context.getParent();
        while (parent != null) {
            context = parent;
            parent = context.getParent();
        }
        return context;
    }

    private class NodeJSGlobalObjectFactory extends DynJSGlobalObjectFactory {
        private Process process;

        NodeJSGlobalObjectFactory(DynJS runtime) {
            ExecutionContext context = getRootContext(runtime);
            this.process = new Process(context.getGlobalObject(), null);
        }
        
        @Override
        public GlobalObject newGlobalObject(final DynJS runtime) {
            GlobalObject global = super.newGlobalObject(runtime);
            global.defineGlobalProperty("process", this.process);
            global.defineGlobalProperty("Buffer", "foo");
            return global;
        }
    }
    
}
