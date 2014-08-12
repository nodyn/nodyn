/*
 * Copyright 2014 Red Hat, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package io.nodyn;


import io.netty.channel.EventLoopGroup;
import io.nodyn.loop.ManagedEventLoopGroup;
import io.nodyn.loop.RefHandle;
import io.nodyn.loop.RootManagedEventLoopGroup;
import org.dynjs.exception.ThrowException;
import org.dynjs.runtime.*;
import org.vertx.java.core.Vertx;
import org.vertx.java.core.VertxFactory;
import org.vertx.java.core.impl.DefaultVertx;

import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.Arrays;

public class Nodyn extends DynJS {

    private static final String NODE_JS = "node.js";
    private static final String PROCESS = "nodyn/process.js";
    private static final String ES6_POLYFILL = "nodyn/polyfill.js";

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
        if (this.exitHandler != null) {
            this.exitHandler.reallyExit(exitCode);
        } else {
            System.exit(exitCode);
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
        public Throwable error;
    }

    public int run() throws Throwable {

        final RefHandle handle = this.managedLoop.newHandle();
        EventLoopGroup elg = this.managedLoop.getEventLoopGroup();

        final CompletionHandler completionHandler = new CompletionHandler();

        elg.submit(new Runnable() {
            @Override
            public void run() {
                try {
                    completionHandler.process = initialize();
                } catch (Throwable t) {
                    completionHandler.error = t;
                } finally {
                    handle.unref();
                }
            }
        });

        if (this.managedLoop instanceof RootManagedEventLoopGroup) {
            ((RootManagedEventLoopGroup) this.managedLoop).await();
        }

        if (completionHandler.error != null ) {
            throw completionHandler.error;
        }

        if (completionHandler.process == null ) {
            return -255;
        }

        return completionHandler.process.getExitCode();
    }

    public NodeProcess initialize() {
        NodeProcess javaProcess = new NodeProcess(Nodyn.this);

        // Adds ES6 capabilities not provided by DynJS to global scope
        Nodyn.this.run(ES6_POLYFILL);

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
