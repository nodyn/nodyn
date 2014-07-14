package io.nodyn;


import io.netty.channel.EventLoopGroup;
import io.nodyn.netty.ManagedEventLoopGroup;
import io.nodyn.netty.RefHandle;
import org.dynjs.runtime.DynJS;
import org.dynjs.runtime.GlobalObject;
import org.dynjs.runtime.Runner;
import org.vertx.java.core.Vertx;
import org.vertx.java.core.VertxFactory;
import org.vertx.java.core.impl.DefaultVertx;

import java.io.*;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.CountDownLatch;

public class Nodyn extends DynJS {

    public static final String VERSION = "0.1.0";
    private static final String NODE_JS = "node.js";

    private final Vertx vertx;
    private final CountDownLatch initComplete = new CountDownLatch(1);
    private final NodynConfig config;

    private final ManagedEventLoopGroup managedLoop;

    public Nodyn(Nodyn parent) {
        this(parent, parent.config);
    }

    public Nodyn(final NodynConfig config) {
        this(null, config);
    }

    public Nodyn(final Nodyn parent, NodynConfig config) {
        super(config);

        this.config = config;


        if (parent == null) {
            System.setProperty("vertx.pool.eventloop.size", "1");
            if (config.isClustered()) {
                this.vertx = VertxFactory.newVertx(config.getHost());
            } else {
                this.vertx = VertxFactory.newVertx();
            }
        } else {
            this.vertx = parent.vertx;
        }

        GlobalObject globalObject = getGlobalObject();
        globalObject.defineGlobalProperty("__vertx", vertx, false);
        globalObject.defineGlobalProperty("__dirname", System.getProperty("user.dir"));
        globalObject.defineGlobalProperty("__filename", NODE_JS); // TODO: This should be a file name sometimes
        globalObject.defineGlobalProperty("__nodyn", this, false);

        EventLoopGroup elg = ((DefaultVertx) vertx).getEventLoopGroup();
        if (parent == null) {
            this.managedLoop = new ManagedEventLoopGroup(elg);
        } else {
            this.managedLoop = parent.managedLoop;
        }
    }

    public ManagedEventLoopGroup getManagedLoop() {
        return this.managedLoop;
    }

    public Vertx getVertx() {
        return this.vertx;
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

    public Object start(Runner runner) {
        loadFromClasspath(NODE_JS);
        RefHandle handle = this.managedLoop.newHandle();
        try {
            if (runner != null) {
                Object result = runner.execute();
                return result;
            }
        } finally {
            handle.unref();
        }

        return null;
    }

    public RefHandle start() {
        loadFromClasspath(NODE_JS);
        return this.managedLoop.newHandle();
    }
}
