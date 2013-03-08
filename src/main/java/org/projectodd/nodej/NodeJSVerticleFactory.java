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
        ExecutionContext context = runtime.getExecutionContext();
        runtime.getConfig().setGlobalObjectFactory(new NodeJSGlobalObjectFactory(context));
        try {
            loadScript(context, "node.js");
        } catch (FileNotFoundException e) {
            System.err.println("Cannot initialize NodeJ");
            e.printStackTrace();
        }
    }

    private class NodeJSGlobalObjectFactory extends DynJSGlobalObjectFactory {
        private Process process;

        NodeJSGlobalObjectFactory(ExecutionContext context) {
            process = new Process(context.getGlobalObject(), null);
        }
        
        @Override
        public GlobalObject newGlobalObject(final DynJS runtime) {
            GlobalObject global = super.newGlobalObject(runtime);
            global.defineGlobalProperty("process", process);
            return global;
        }
    }
    
}
