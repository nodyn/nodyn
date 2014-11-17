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


import io.nodyn.NodeProcess;
import io.nodyn.Nodyn;
import io.nodyn.runtime.NodynConfig;
import io.nodyn.runtime.Program;
import org.dynjs.Config;
import org.dynjs.debugger.agent.DebuggerAgent;
import org.dynjs.exception.ThrowException;
import org.dynjs.runtime.Compiler;
import org.dynjs.runtime.*;
import org.dynjs.runtime.builtins.DynJSBuiltin;
import org.dynjs.runtime.builtins.Require;
import org.dynjs.runtime.source.ClassLoaderSourceProvider;
import org.vertx.java.core.Vertx;
import org.vertx.java.core.VertxFactory;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;

public class DynJSRuntime extends Nodyn {

    private final DynJS runtime;
    private final Runner runner;

    public DynJSRuntime(NodynConfig config) {
        this(VertxFactory.newVertx(), config, true);
    }

    public DynJSRuntime(Vertx vertx, NodynConfig config, boolean controlLifeCycle) {
        super(config, vertx, controlLifeCycle);

        Config dynjsConfig = new Config(config.getClassLoader());
        dynjsConfig.setExposeDebugAs("v8debug");

        this.runtime = new DynJS(dynjsConfig);

        this.runner = this.runtime.newRunner(config.getDebug());
        if (config.getDebug()) {
            DebuggerAgent agent = new DebuggerAgent(this.runner.getDebugger(), this.getEventLoop().getEventLoopGroup(), getConfiguration().getDebugPort());
        }
    }

    @Override
    public Object loadBinding(String name) {
        this.runner.withSource("__native_require('nodyn/bindings/" + name + "');");
        return runner.execute();
    }

    @Override
    public Program compile(String source, String fileName, boolean displayErrors) throws Throwable {
        try {
            return new DynJSProgram(this, this.runner.getDebugger(), source, fileName);
        } catch (Throwable t) {
            if (displayErrors) {
                this.handleThrowable(t);
            }
            throw t;
        }
    }

    @Override
    public void makeContext(Object global) {
        new DynJS(runtime.getConfig(), (JSObject) global);
    }

    @Override
    public boolean isContext(Object global) {
        if (global instanceof DynObject) {
            final Object dynjs = ((DynObject) global).get("dynjs");
            if (dynjs != null) {
                return ((DynJSBuiltin) dynjs).getRuntime() != null;
            }
        }
        return false;
    }

    @Override
    public void handleThrowable(Throwable t) {
        if (t instanceof ThrowException) {
            ThrowException e = (ThrowException) t;
            Object value = e.getValue();
            if (value != null && value instanceof JSObject) {
                Object stack = ((JSObject) value).get(this.runtime.getDefaultExecutionContext(), "stack");
                System.err.print(stack);
            } else if (t.getCause() != null) {
                this.handleThrowable(new ThrowException(null, e.getCause()));
            } else {
                this.handleThrowable(new ThrowException(null, e));
            }
        } else {
            this.handleThrowable(new ThrowException(null, t));
        }
    }

    @Override
    public Object getGlobalContext() {
        return this.runtime.getGlobalContext().getObject();
    }

    @Override
    protected NodeProcess initialize() {
        try {
            JSObject globalObject = runtime.getGlobalContext().getObject();
            globalObject.defineOwnProperty(null, "__vertx", PropertyDescriptor.newDataPropertyDescriptor(getVertx(), true, true, false), false);
            globalObject.defineOwnProperty(null, "__dirname", PropertyDescriptor.newDataPropertyDescriptor(System.getProperty("user.dir"), true, true, true), false);
            globalObject.defineOwnProperty(null, "__filename", PropertyDescriptor.newDataPropertyDescriptor(Nodyn.NODE_JS, true, true, true), false);
            globalObject.defineOwnProperty(null, "__nodyn", PropertyDescriptor.newDataPropertyDescriptor(this, true, true, false), false);
            globalObject.defineOwnProperty(null, "__native_require", PropertyDescriptor.newDataPropertyDescriptor(new Require(runtime.getGlobalContext()), true, true, true), false);

            NodeProcess javaProcess = new NodeProcess(this);

            getEventLoop().setProcess(javaProcess);

            // Adds ES6 capabilities not provided by DynJS to global scope
            runScript(ES6_POLYFILL);

            JSFunction processFunction = (JSFunction) runScript(PROCESS);
            JSObject jsProcess = (JSObject) runtime.getDefaultExecutionContext().call(processFunction, runtime.getGlobalContext().getObject(), javaProcess);

            //if ( getConfiguration().getDebug() ) {
            //this.runner.getDebugger().setWaitConnect( getConfiguration().getDebugWaitConnect() );
            //}
            JSFunction nodeFunction = (JSFunction) runScript(NODE_JS);
            runtime.getDefaultExecutionContext().call(nodeFunction, runtime.getGlobalContext().getObject(), jsProcess);
            return javaProcess;
        } catch (Exception e) {
            System.err.println("Unable to initialize Nodyn. Exiting.");
            e.printStackTrace();
            System.exit(255);
        }
        return null;
    }

    @Override
    protected Object runScript(String scriptName) throws IOException {
        this.runner.withSource( new ClassLoaderSourceProvider( this.runtime.getConfig().getClassLoader(), scriptName));
        this.runner.withFileName(scriptName);
        return runner.execute();
    }

    protected Compiler newCompiler() {
        return runtime.newCompiler();
    }
}
