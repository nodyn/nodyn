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

package io.nodyn.runtime.dynjs;


import io.netty.channel.EventLoopGroup;
import io.nodyn.ExitHandler;
import io.nodyn.NodeProcess;
import io.nodyn.Nodyn;
import io.nodyn.NodynConfig;
import io.nodyn.loop.EventLoop;
import io.nodyn.runtime.Program;
import org.dynjs.runtime.*;
import org.dynjs.runtime.builtins.Require;
import org.vertx.java.core.Vertx;
import org.vertx.java.core.VertxFactory;
import org.vertx.java.core.impl.VertxInternal;

import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.List;

public class DynJSRuntime extends DynJS implements Nodyn {

    private static final String NODE_JS = "node.js";
    private static final String PROCESS = "nodyn/process.js";
    private static final String ES6_POLYFILL = "nodyn/polyfill.js";

    private final Vertx vertx;
    private final EventLoop eventLoop;
    private ExitHandler exitHandler;
    private CompletionHandler completionHandler;


    public DynJSRuntime(NodynConfig config) {
        this((config.isClustered() ? VertxFactory.newVertx(config.getHost()) : VertxFactory.newVertx()),
                config,
                true);
    }

    public DynJSRuntime(Vertx vertx, NodynConfig config) {
        this(vertx,
                config,
                false);
    }

    public DynJSRuntime(Vertx vertx, NodynConfig config, boolean controlLifeCycle) {
        super(config);

        this.vertx = vertx;

        GlobalObject globalObject = getGlobalObject();
        globalObject.defineGlobalProperty("__vertx", vertx, false);
        globalObject.defineGlobalProperty("__dirname", System.getProperty("user.dir"));
        globalObject.defineGlobalProperty("__filename", NODE_JS);
        globalObject.defineGlobalProperty("__nodyn", this, false);

        globalObject.defineGlobalProperty("__native_require", new Require( globalObject ));

        EventLoopGroup elg = ((VertxInternal) vertx).getEventLoopGroup();
        this.eventLoop = new EventLoop(elg, controlLifeCycle);

        String[] argv = (String[]) config.getArgv();
        List<String> filteredArgv = new ArrayList<>();

        for (String anArgv : argv) {
            if (!anArgv.startsWith("--")) {
                filteredArgv.add(anArgv);
            }
        }

        config.setArgv(filteredArgv.toArray());
    }

    @Override
    public void setExitHandler(ExitHandler handle) {
        this.exitHandler = handle;
    }

    @Override
    public ExitHandler getExitHandler() {
        return this.exitHandler;
    }

    @Override
    public void reallyExit(int exitCode) {
        this.eventLoop.shutdown();
        if (this.exitHandler != null) {
            this.exitHandler.reallyExit(exitCode);
        } else {
            System.exit(exitCode);
        }
    }

    @Override
    public EventLoop getEventLoop() {
        return this.eventLoop;
    }

    @Override
    public Vertx getVertx() {
        return this.vertx;
    }

    @Override
    public int run() throws Throwable {
        start();
        return await();
    }

    @Override
    public Object loadBinding(String name) {
        Runner runner = this.newRunner();
        runner.withSource("__native_require('nodyn/bindings/" + name + "');");
        return runner.execute();
    }

    @Override
    public Program compile(String source, String fileName, boolean displayErrors) throws Throwable {
        try {
            return new DynJSProgram(this, source, fileName);
        } catch (Throwable t) {
            if ( displayErrors ) {
                t.printStackTrace();
            }
            throw t;
        }
    }

    @Override
    public NodynConfig getConfiguration() {
        return (NodynConfig) this.getConfig();
    }

    private void start() {
        start(null);
    }

    private void start(final Runnable callback) {
        this.completionHandler = new CompletionHandler();
        this.eventLoop.submitUserTask(new Runnable() {
            @Override
            public void run() {
                try {
                    DynJSRuntime.this.completionHandler.process = initialize();
                } catch (Throwable t) {
                    DynJSRuntime.this.completionHandler.error = t;
                } finally {
                    if (callback != null) {
                        callback.run();
                    }
                }
            }
        }, "init");
    }

    private void shutdown() {
        this.eventLoop.shutdown();
    }

    private int await() throws Throwable {
        this.eventLoop.await();

        if (this.completionHandler.error != null) {
            throw completionHandler.error;
        }

        if (this.completionHandler.process == null) {
            return -255;
        }

        return this.completionHandler.process.getExitCode();
    }


    private NodeProcess initialize() {
        NodeProcess javaProcess = new NodeProcess(DynJSRuntime.this);

        this.eventLoop.setProcess( javaProcess );

        // Adds ES6 capabilities not provided by DynJS to global scope
        DynJSRuntime.this.run(ES6_POLYFILL);

        JSFunction processFunction = (JSFunction) DynJSRuntime.this.run(PROCESS);
        JSObject jsProcess = (JSObject) getDefaultExecutionContext().call(processFunction, getGlobalObject(), javaProcess);

        JSFunction nodeFunction = (JSFunction) DynJSRuntime.this.run(NODE_JS);
        getDefaultExecutionContext().call(nodeFunction, getGlobalObject(), jsProcess);

        return javaProcess;
    }

    private Object run(String scriptName) {
        Runner runner = newRunner();
        InputStream repl = getConfig().getClassLoader().getResourceAsStream(scriptName);
        BufferedReader in = new BufferedReader(new InputStreamReader(repl));
        runner.withSource(in);
        runner.withFileName(scriptName);
        return runner.execute();
    }

    private static class CompletionHandler {
        public NodeProcess process;
        public Throwable error;
    }
}
