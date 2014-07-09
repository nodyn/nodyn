package io.nodyn;



import org.dynjs.runtime.DynJS;
import org.dynjs.runtime.GlobalObject;
import org.dynjs.runtime.Runner;
import org.vertx.java.core.Handler;
import org.vertx.java.core.Vertx;
import org.vertx.java.core.VertxFactory;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;

public class Nodyn extends DynJS {

    public static final String VERSION = "0.1.0";
    private static final String NODE_JS = "node.js";

    private final Vertx vertx;

    public Nodyn(final NodynConfig config) {
        super(config);

        if (config.isClustered()) {
            vertx = VertxFactory.newVertx(config.getHost());
        } else {
            vertx = VertxFactory.newVertx();
        }
        GlobalObject globalObject = getGlobalObject();
        globalObject.defineGlobalProperty("__vertx", vertx);
        globalObject.defineGlobalProperty("__dirname", System.getProperty("user.dir"));
        globalObject.defineGlobalProperty("__filename", NODE_JS); // TODO: This should be a file name sometimes

        vertx.runOnContext(new Handler<Void>() {
            @Override
            public void handle(Void aVoid) {
                InputStream is = config.getClassLoader().getResourceAsStream(NODE_JS);
                if (is != null) {
                    BufferedReader reader = new BufferedReader(new InputStreamReader(is));
                    newRunner().withFileName(NODE_JS).withSource(reader).evaluate();
                    try {
                        is.close();
                    } catch (IOException e) {
                        // ignore
                    }
                } else {
                    config.getErrorStream().println("[ERROR] Cannot initialize Nodyn");
                }
            }
        });
    }
}
