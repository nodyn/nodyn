package org.projectodd.nodyn;

import org.dynjs.Config;
import org.dynjs.runtime.*;
import org.dynjs.vertx.DynJSVerticle;
import org.dynjs.vertx.DynJSVerticleFactory;
import org.projectodd.nodyn.buffer.BufferType;
import org.projectodd.nodyn.util.QueryString;
import org.vertx.java.platform.Verticle;

import java.io.*;

public class NodeJSVerticleFactory extends DynJSVerticleFactory {
    private String filename;

    @Override
    public Verticle createVerticle(String main) throws Exception {
        this.filename = main;
        Config config = new Config(getClassLoader());
        config.setGlobalObjectFactory(new NodeJSGlobalObjectFactory());
        return new NodeJSVerticle(new DynJS(config), main);
    }

    public class NodeJSGlobalObjectFactory extends DynJSGlobalObjectFactory {
        @Override
        public GlobalObject newGlobalObject(final DynJS runtime) {
            GlobalObject global = super.newGlobalObject(runtime);
            BufferType bufferType = new BufferType(global);
            DynObject node = new DynObject(global);
            node.put("buffer", bufferType);
            node.put("QueryString", new QueryString(global));
            global.defineGlobalProperty("nodyn", node);
            global.defineGlobalProperty("__filename", filename);
            global.defineGlobalProperty("__dirname", new File(filename).getParent());
            return global;
        }
    }

    public static void initScript(ExecutionContext context, String name, DynJS runtime) {
        InputStream is = runtime.getConfig().getClassLoader().getResourceAsStream(name);
        if (is != null) {
            BufferedReader reader = new BufferedReader(new InputStreamReader(is));
            runtime.newRunner().withContext(context).withSource(reader).evaluate();
            try {
                is.close();
            } catch (IOException e) {
                // ignore
            }
        } else {
            System.err.println("[ERROR] Cannot initialize Nodyn.");
        }
    }

    protected class NodeJSVerticle extends DynJSVerticle {

        public NodeJSVerticle(DynJS runtime, String scriptName) {
            super(runtime, scriptName);
        }

        @Override
        protected ExecutionContext initializeRootContext() {
            final DynJS runtime = getRuntime();
            return ExecutionContext.createGlobalExecutionContext(runtime, new InitializationListener() {
                @Override
                public void initialize(ExecutionContext context) {
                    initScript(context, "npm_modules.js", runtime);
                    initScript(context, "node.js", runtime);
                }
            });
        }
    }

}
