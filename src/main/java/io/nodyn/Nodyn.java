package io.nodyn;


import io.netty.channel.EventLoopGroup;
import io.nodyn.loop.ManagedEventLoopGroup;
import io.nodyn.loop.RefHandle;
import io.nodyn.loop.RootManagedEventLoopGroup;
import org.dynjs.runtime.*;
import org.vertx.java.core.Vertx;
import org.vertx.java.core.VertxFactory;
import org.vertx.java.core.impl.DefaultVertx;

import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;

public class Nodyn extends DynJS {

    private static final String NODE_JS = "node.js";
    private static final String PROCESS = "nodyn/process.js";

    private final Vertx vertx;
    private final NodynConfig config;

    private final ManagedEventLoopGroup managedLoop;

    private ExitHandler exitHandler;

    private boolean started;

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
            this.managedLoop = new RootManagedEventLoopGroup(elg);
        } else {
            this.managedLoop = parent.managedLoop.newChild();
        }
    }

    public void setExitHandler(ExitHandler handle) {
        this.exitHandler = handle;
    }

    public ExitHandler getExitHandler() {
        return this.exitHandler;
    }

    void reallyExit(int exitCode) {
        this.managedLoop.shutdown();
        if ( this.exitHandler != null ) {
            this.exitHandler.reallyExit( exitCode );
        } else {
            System.exit( exitCode );
        }
    }

    public ManagedEventLoopGroup getEventLoop() {
        return this.managedLoop;
    }

    public Vertx getVertx() {
        return this.vertx;
    }

    private static class CompletionHandler {
        public NodeProcess process;
    }

    public int run() throws InterruptedException {
        final RefHandle handle = this.managedLoop.newHandle();
        EventLoopGroup elg = this.managedLoop.getEventLoopGroup();

        final CompletionHandler completionHandler = new CompletionHandler();

        elg.submit(new Runnable() {
            @Override
            public void run() {
                try {
                    completionHandler.process = initialize();
                } catch (Throwable t) {
                    t.printStackTrace();

                } finally
                {
                    handle.unref();
                }
            }
        });

        if (this.managedLoop instanceof RootManagedEventLoopGroup) {
            ((RootManagedEventLoopGroup) this.managedLoop).await();
        }

        return completionHandler.process.getExitCode();
    }

    public NodeProcess initialize() {
        NodeProcess javaProcess = new NodeProcess(Nodyn.this);

        JSFunction processFunction = (JSFunction) Nodyn.this.run(PROCESS);
        JSObject jsProcess = (JSObject) getDefaultExecutionContext().call(processFunction, getGlobalObject(), javaProcess);

        JSFunction nodeFunction = (JSFunction) Nodyn.this.run(NODE_JS);
        getDefaultExecutionContext().call(nodeFunction, getGlobalObject(), jsProcess);

        return javaProcess;
    }

    protected Object run(String scriptName) {
        Runner runner = newRunner();
        InputStream repl = getConfig().getClassLoader().getResourceAsStream(scriptName);
        BufferedReader in = new BufferedReader(new InputStreamReader(repl));
        runner.withSource(in);
        runner.withFileName(scriptName);
        return runner.execute();
    }

}
