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
import io.nodyn.runtime.Program;
import org.dynjs.Config;
import org.dynjs.exception.ThrowException;
import org.dynjs.runtime.*;
import org.dynjs.runtime.Compiler;
import org.dynjs.runtime.builtins.DynJSBuiltin;
import org.dynjs.runtime.builtins.Require;
import org.vertx.java.core.Vertx;
import org.vertx.java.core.VertxFactory;

import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.List;

public class DynJSRuntime extends Nodyn {

    private final DynJS runtime;

    public DynJSRuntime(DynJSConfig config) {
        this((config.isClustered() ? VertxFactory.newVertx(config.getHost()) : VertxFactory.newVertx()),
                config,
                true);
    }

    public DynJSRuntime(Vertx vertx, DynJSConfig config, boolean controlLifeCycle) {
        super(config, vertx, controlLifeCycle);
        this.runtime = new DynJS(config);
    }

    @Override
    public Object loadBinding(String name) {
        Runner runner = runtime.newRunner();
        runner.withSource("__native_require('nodyn/bindings/" + name + "');");
        return runner.execute();
    }

    @Override
    public Program compile(String source, String fileName, boolean displayErrors) throws Throwable {
        try {
            return new DynJSProgram(this, source, fileName);
        } catch (Throwable t) {
            if ( displayErrors ) {
                this.handleThrowable(t);
            }
            throw t;
        }
    }

    @Override
    public void makeContext(Object global) {
        new DynJS((Config)this.getConfiguration(), (JSObject) global);
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
            } else if ( t.getCause() != null ) {
                this.handleThrowable(new ThrowException(null, e.getCause()));
            } else {
                this.handleThrowable(new ThrowException(null, e));
            }
        }
        else {
            this.handleThrowable(new ThrowException(null, t));
        }
    }

    @Override
    public Object getGlobalContext() {
        return this.runtime.getGlobalContext().getObject();
    }

    @Override
    protected NodeProcess initialize() {
        JSObject globalObject = runtime.getGlobalContext().getObject();
        globalObject.defineOwnProperty(null, "__vertx", PropertyDescriptor.newDataPropertyDescriptor(getVertx(), true, true, false), false);
        globalObject.defineOwnProperty(null, "__dirname", PropertyDescriptor.newDataPropertyDescriptor(System.getProperty("user.dir"), true, true, true), false);
        globalObject.defineOwnProperty(null, "__filename", PropertyDescriptor.newDataPropertyDescriptor(Nodyn.NODE_JS, true, true, true), false);
        globalObject.defineOwnProperty(null, "__nodyn", PropertyDescriptor.newDataPropertyDescriptor(this, true, true, false), false);
        globalObject.defineOwnProperty(null, "__native_require", PropertyDescriptor.newDataPropertyDescriptor(new Require(runtime.getGlobalContext()), true, true, true), false);

        String[] argv = (String[]) getConfiguration().getArgv();
        List<String> filteredArgv = new ArrayList<>();

        for (String anArgv : argv) {
            // --debug-port not currently supported
            if (!anArgv.startsWith("--debug-port")) {
                filteredArgv.add(anArgv);
            }
        }

        getConfiguration().setArgv(filteredArgv.toArray());

        NodeProcess javaProcess = new NodeProcess(this);

        getEventLoop().setProcess(javaProcess);

        // Adds ES6 capabilities not provided by DynJS to global scope
        runScript(ES6_POLYFILL);

        JSFunction processFunction = (JSFunction) runScript(PROCESS);
        JSObject jsProcess = (JSObject) runtime.getDefaultExecutionContext().call(processFunction, runtime.getGlobalContext().getObject(), javaProcess);

        JSFunction nodeFunction = (JSFunction) runScript(NODE_JS);
        try {
            runtime.getDefaultExecutionContext().call(nodeFunction, runtime.getGlobalContext().getObject(), jsProcess);
        } catch (Exception e) {
            System.err.println("Unable to initialize Nodyn. Exiting.");
            e.printStackTrace();
            System.exit(255);
        }
        return javaProcess;
    }

    @Override
    protected Object runScript(String scriptName) {
        Runner runner = runtime.newRunner();
        InputStream repl = runtime.getConfig().getClassLoader().getResourceAsStream(scriptName);
        BufferedReader in = new BufferedReader(new InputStreamReader(repl));
        runner.withSource(in);
        runner.withFileName(scriptName);
        return runner.execute();
    }

    protected Compiler newCompiler() {
        return runtime.newCompiler();
    }
}
