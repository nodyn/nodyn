package org.projectodd.nodyn;

import org.dynjs.Config;
import org.dynjs.runtime.DynJS;
import org.dynjs.runtime.ExecutionContext;
import org.dynjs.runtime.InitializationListener;
import org.dynjs.vertx.DynJSVerticle;
import org.dynjs.vertx.DynJSVerticleFactory;
import org.vertx.java.platform.Verticle;

import java.io.*;

public class NodeJSVerticleFactory extends DynJSVerticleFactory {
    private String filename;

    @Override
    public Verticle createVerticle(String main) throws Exception {
        this.filename = main;
        Config config = new Config(getClassLoader());
        return new NodeJSVerticle(new DynJS(config), main);
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
                    initScript(context, "node.js", runtime);
                    context.getGlobalObject().defineGlobalProperty("__dirname", new File(filename).getParent());
                    context.getGlobalObject().defineGlobalProperty("__filename", filename);
                }
            });
        }
    }

}
