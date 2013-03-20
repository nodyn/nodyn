package org.projectodd.nodej;

import java.io.FileNotFoundException;

import org.dynjs.runtime.DynJS;
import org.dynjs.runtime.ExecutionContext;
import org.dynjs.runtime.GlobalObject;
import org.dynjs.runtime.GlobalObjectFactory;
import org.dynjs.runtime.InitializationListener;
import org.dynjs.vertx.DynJSVerticleFactory;

public class NodeJSVerticleFactory extends DynJSVerticleFactory {
    private GlobalObjectFactory globalObjectFactory = new NodeJSGlobalObjectFactory();

    protected ExecutionContext initializeRootContext() {
        return ExecutionContext.createGlobalExecutionContext(getRuntime(), new InitializationListener()
        {
            @Override
            public void initialize(ExecutionContext context) {
                try {
                    loadScript(context, "vertx.js");
                    loadScript(context, "node.js");
                } catch (FileNotFoundException e) {
                    System.err.println("Missing file. Cannot initialize NodeJ.");
                    e.printStackTrace();
                }
            }
        });
    }

    @Override
    protected GlobalObjectFactory getGlobalObjectFactory() {
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
