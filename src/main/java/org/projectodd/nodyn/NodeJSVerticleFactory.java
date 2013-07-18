package org.projectodd.nodyn;

import org.dynjs.runtime.DynJS;
import org.dynjs.runtime.DynObject;
import org.dynjs.runtime.ExecutionContext;
import org.dynjs.runtime.GlobalObject;
import org.dynjs.runtime.GlobalObjectFactory;
import org.dynjs.runtime.InitializationListener;
import org.dynjs.vertx.DynJSVerticle;
import org.dynjs.vertx.DynJSVerticleFactory;
import org.projectodd.nodyn.util.QueryString;
import org.projectodd.nodyn.buffer.BufferType;
import org.vertx.java.platform.Verticle;

public class NodeJSVerticleFactory extends DynJSVerticleFactory {
    private GlobalObjectFactory globalObjectFactory = new NodeJSGlobalObjectFactory();
    private String filename;

    @Override
    protected GlobalObjectFactory getGlobalObjectFactory() {
        return this.globalObjectFactory;
    }

    @Override
    public Verticle createVerticle(String main) throws Exception {
        this.filename = main;
        return new NodeJSVerticle(this, main);
    }

    private class NodeJSGlobalObjectFactory extends DynJSGlobalObjectFactory {
        @Override
        public GlobalObject newGlobalObject(final DynJS runtime) {
            GlobalObject global = super.newGlobalObject(runtime);
            BufferType bufferType = new BufferType(global);
            DynObject node = new DynObject(global);
            node.put("buffer", bufferType);
            node.put("QueryString", new QueryString(global));
            global.defineGlobalProperty("nodyn", node);
            global.defineGlobalProperty("Buffer", bufferType);
            global.defineGlobalProperty("__filename", filename);
            return global;
        }
    }
    
    protected class NodeJSVerticle extends DynJSVerticle {

        public NodeJSVerticle(DynJSVerticleFactory factory, String scriptName) {
            super(factory, scriptName);
        }
        
        @Override
        protected ExecutionContext initializeRootContext() {
            return ExecutionContext.createGlobalExecutionContext(getRuntime(), new InitializationListener()
            {
                @Override
                public void initialize(ExecutionContext context) {
                    try {
                        getRuntime().evaluate("include('node.js')");
                    } catch (Exception e) {
                        System.err.println("[ERROR] Cannot initialize Nodyn. " + e.getMessage());
                        e.printStackTrace();
                    }
                }
            });
        }

    }

}
