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
import io.nodyn.loop.EventLoop;
import io.nodyn.loop.RefHandle;
import org.dynjs.runtime.*;
import org.dynjs.runtime.builtins.Require;
import org.vertx.java.core.Vertx;
import org.vertx.java.core.VertxFactory;
import org.vertx.java.core.impl.DefaultVertx;
import org.vertx.java.core.impl.VertxInternal;

import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.List;

public class Nodyn extends DynJS {

    public static final String VERSION = "0.1.1-SNAPSHOT"; // TODO: This should come from pom.xml
    private static final String NODE_JS = "node.js";
    private static final String PROCESS = "nodyn/process.js";
    private static final String ES6_POLYFILL = "nodyn/polyfill.js";

    private final Vertx vertx;
    private final NodynConfig config;

    private final EventLoop eventLoop;

    private ExitHandler exitHandler;

    private boolean started;
    private CompletionHandler completionHandler;


    public Nodyn(NodynConfig config) {
        this((config.isClustered() ? VertxFactory.newVertx(config.getHost()) : VertxFactory.newVertx()),
                config,
                true);
    }

    public Nodyn(Vertx vertx, NodynConfig config) {
        this(vertx,
                config,
                false);
    }

    public Nodyn(Vertx vertx, NodynConfig config, boolean controlLifeCycle) {
        super(config);
        this.config = config;

        this.vertx = vertx;

        JSObject globalObject = getGlobalContext().getObject();
        globalObject.defineOwnProperty(null, "__vertx", PropertyDescriptor.newDataPropertyDescriptor(vertx, true, true, false), false);
        globalObject.defineOwnProperty(null, "__dirname", PropertyDescriptor.newDataPropertyDescriptor(System.getProperty("user.dir") , true, true, true), false);
        globalObject.defineOwnProperty(null, "__filename", PropertyDescriptor.newDataPropertyDescriptor(NODE_JS , true, true, true), false);
        globalObject.defineOwnProperty(null, "__nodyn", PropertyDescriptor.newDataPropertyDescriptor(this , true, true, false), false);
        globalObject.defineOwnProperty(null, "__native_require", PropertyDescriptor.newDataPropertyDescriptor(new Require( getGlobalContext() ) , true, true, true), false);

        EventLoopGroup elg = ((VertxInternal) vertx).getEventLoopGroup();
        this.eventLoop = new EventLoop(elg, controlLifeCycle);

        String[] argv = (String[]) this.config.getArgv();
        List<String> filteredArgv = new ArrayList<>();

        for ( int i = 0 ; i < argv.length ; ++i ) {
            if ( argv[i].startsWith("--" ) ) {
                // skip it
            } else {
                filteredArgv.add( argv[i] );
            }
        }

        this.config.setArgv( filteredArgv.toArray() );

    }

    public void setExitHandler(ExitHandler handle) {
        this.exitHandler = handle;
    }

    public ExitHandler getExitHandler() {
        return this.exitHandler;
    }

    void reallyExit(int exitCode) {
        this.eventLoop.shutdown();
        if (this.exitHandler != null) {
            this.exitHandler.reallyExit(exitCode);
        } else {
            System.exit(exitCode);
        }
    }

    public EventLoop getEventLoop() {
        return this.eventLoop;
    }

    public Vertx getVertx() {
        return this.vertx;
    }

    private static class CompletionHandler {
        public NodeProcess process;
        public Throwable error;
    }

    public int run() throws Throwable {
        start();
        return await();
    }

    public void start() {
        start(null);
    }

    public void start(final Runnable callback) {
        this.completionHandler = new CompletionHandler();
        this.eventLoop.submitUserTask(new Runnable() {
            @Override
            public void run() {
                try {
                    Nodyn.this.completionHandler.process = initialize();
                } catch (Throwable t) {
                    Nodyn.this.completionHandler.error = t;
                } finally {
                    if (callback != null) {
                        callback.run();
                    }
                }
            }
        }, "init");
    }

    public void shutdown() {
        this.eventLoop.shutdown();
    }

    public int await() throws Throwable {
        this.eventLoop.await();

        if (this.completionHandler.error != null) {
            throw completionHandler.error;
        }

        if (this.completionHandler.process == null) {
            return -255;
        }

        return this.completionHandler.process.getExitCode();
    }


    public NodeProcess initialize() {
        NodeProcess javaProcess = new NodeProcess(Nodyn.this);

        this.eventLoop.setProcess( javaProcess );

        // Adds ES6 capabilities not provided by DynJS to global scope
        Nodyn.this.run(ES6_POLYFILL);

        JSFunction processFunction = (JSFunction) Nodyn.this.run(PROCESS);
        JSObject jsProcess = (JSObject) getDefaultExecutionContext().call(processFunction, getGlobalContext().getObject(), javaProcess);

        JSFunction nodeFunction = (JSFunction) Nodyn.this.run(NODE_JS);
        getDefaultExecutionContext().call(nodeFunction, getGlobalContext().getObject(), jsProcess);

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
