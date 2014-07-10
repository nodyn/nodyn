package io.nodyn;


import io.nodyn.netty.ManagedEventLoopGroup;
import io.nodyn.netty.RefHandle;
import org.dynjs.runtime.DynJS;
import org.dynjs.runtime.GlobalObject;
import org.dynjs.runtime.Runner;
import org.vertx.java.core.Handler;
import org.vertx.java.core.Vertx;
import org.vertx.java.core.VertxFactory;

import java.io.*;
import java.util.concurrent.CountDownLatch;

public class Nodyn extends DynJS {

    public static final String VERSION = "0.1.0";
    private static final String NODE_JS = "node.js";

    private final Vertx vertx;
    private final CountDownLatch initComplete;
    private final NodynConfig config;

    public Nodyn(final NodynConfig config) {
        super(config);

        this.initComplete = new CountDownLatch(1);
        this.config = config;

        System.setProperty("vertx.pool.eventloop.size", "1");

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
                loadFromClasspath(NODE_JS);
                initComplete.countDown();
            }
        });
    }

    private void loadFromClasspath(String resource) {
        InputStream is = this.config.getClassLoader().getResourceAsStream(resource);
        if (is != null) {
            BufferedReader reader = new BufferedReader(new InputStreamReader(is));
            new Runner(getExecutionContext()).withFileName(resource).withSource(reader).evaluate();
            try {
                is.close();
            } catch (IOException e) {
                // ignore
            }
        } else {
            config.getErrorStream().println("[ERROR] Cannot initialize Nodyn");
        }
    }

    public void start(Runner runner) {
        try {
            this.initComplete.await();

            ManagedEventLoopGroup melg = (ManagedEventLoopGroup) this.newRunner().withSource("process.EVENT_LOOP").execute();
            RefHandle handle = melg.newHandle();

            if (runner != null) {
                runner.execute();
            }

            handle.unref();

        } catch (InterruptedException e) {
            e.printStackTrace();
        }
    }
}
