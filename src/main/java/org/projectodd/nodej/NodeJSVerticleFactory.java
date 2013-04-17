package org.projectodd.nodej;

import java.io.FileNotFoundException;

import org.dynjs.runtime.DynJS;
import org.dynjs.runtime.DynObject;
import org.dynjs.runtime.ExecutionContext;
import org.dynjs.runtime.GlobalObject;
import org.dynjs.runtime.GlobalObjectFactory;
import org.dynjs.runtime.InitializationListener;
import org.dynjs.vertx.DynJSVerticle;
import org.dynjs.vertx.DynJSVerticleFactory;
import org.projectodd.nodej.bindings.buffer.BufferType;
import org.vertx.java.platform.Verticle;

public class NodeJSVerticleFactory extends DynJSVerticleFactory {
    private GlobalObjectFactory globalObjectFactory = new NodeJSGlobalObjectFactory();

    @Override
    protected GlobalObjectFactory getGlobalObjectFactory() {
        return this.globalObjectFactory;
    }

    @Override
    public Verticle createVerticle(String main) throws Exception {
        return new NodeJSVerticle(this, main);
    }

    private class NodeJSGlobalObjectFactory extends DynJSGlobalObjectFactory {
        @Override
        public GlobalObject newGlobalObject(final DynJS runtime) {
            GlobalObject global = super.newGlobalObject(runtime);
            Process process = new Process(global, null);
            BufferType bufferType = new BufferType(global);
            DynObject nodeJ = new DynObject(global);
            nodeJ.put("process", process);
            nodeJ.put("buffer", bufferType);
            global.defineGlobalProperty("nodej", nodeJ);
            global.defineGlobalProperty("process", process); // backwards compat
            global.defineGlobalProperty("Buffer", bufferType); //
            return global;
        }
    }
    
    protected class NodeJSVerticle extends DynJSVerticle {

        public NodeJSVerticle(DynJSVerticleFactory factory, String scriptName) {
            super(factory, scriptName);
        }
        
        @Override
        protected ExecutionContext initializeRootContext() {
            return ExecutionContext.createGlobalExecutionContext(factory.getRuntime(), new InitializationListener()
            {
                @Override
                public void initialize(ExecutionContext context) {
                    try {
                        loadScript(context, "vertx.js");
                        loadScript(context, "node.js");
                    } catch (Exception e) {
                        System.err.println("[ERROR] Cannot initialize NodeJ. " + e.getMessage());
                        e.printStackTrace();
                    }
                }
            });
        }

    }

}
