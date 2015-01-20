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
package io.nodyn.runtime.nashorn;

import io.nodyn.NodeProcess;
import io.nodyn.Nodyn;
import io.nodyn.runtime.NodynConfig;
import io.nodyn.runtime.Program;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.HashMap;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.script.Bindings;
import org.vertx.java.core.Vertx;

import javax.script.ScriptContext;
import javax.script.ScriptEngineManager;
import javax.script.ScriptException;
import javax.script.SimpleScriptContext;
import jdk.nashorn.api.scripting.AbstractJSObject;
import jdk.nashorn.api.scripting.JSObject;
import jdk.nashorn.api.scripting.NashornScriptEngine;

/**
 * @author Lance Ball
 */
public class NashornRuntime extends Nodyn {

    private final ScriptEngineManager factory;
    private final NashornScriptEngine engine;
    private final ScriptContext global;
    private final NodynConfig config;

    public NashornRuntime(NodynConfig config, Vertx vertx, boolean controlLifeCycle) {
        super(config, vertx, controlLifeCycle);
        Thread.currentThread().setContextClassLoader(config.getClassLoader());
        factory = new ScriptEngineManager();
        engine = (NashornScriptEngine) factory.getEngineByName("nashorn");
        global = engine.getContext();
        this.config = config;
    }

    @Override
    public Object loadBinding(String name) {
        try {
            String pathName = "nodyn/bindings/" + name + ".js";
            // Load in its own script context
            ScriptContext context = new SimpleScriptContext();
            context.setBindings(global.getBindings(ScriptContext.GLOBAL_SCOPE), ScriptContext.GLOBAL_SCOPE);

            // Set up module and exports
            NodynJSObject module = new NodynJSObject();
            module.setMember("exports", new NodynJSObject());
            context.setAttribute("module", module, ScriptContext.GLOBAL_SCOPE);

            loadFromClasspath(pathName, context);
            return engine.eval("module.exports");

        } catch (ScriptException e) {
            this.handleThrowable(e);
        }
        return false;
    }

    @Override
    public Program compile(String source, String fileName, boolean displayErrors) throws Throwable {
        // TODO: remove the fileName and displayErrors parameters, as these are specific to DynJS
        try {
            return new NashornProgram(engine.compile(source), fileName);
        } catch (ScriptException ex) {
            Logger.getLogger(NashornRuntime.class.getName()).log(Level.SEVERE, null, ex);
        }
        return null;
    }

    @Override
    public void makeContext(Object global) {

    }

    @Override
    public boolean isContext(Object global) {
        return global instanceof ScriptContext;
    }

    @Override
    public void handleThrowable(Throwable t) {
        System.err.println(t);
        t.printStackTrace(System.err);
    }

    @Override
    protected NodeProcess initialize() {
        Bindings bindings = engine.getBindings(ScriptContext.GLOBAL_SCOPE);
        bindings.put("__vertx", getVertx());
        bindings.put("__dirname", System.getProperty("user.dir"));
        bindings.put("__filename", Nodyn.NODE_JS);
        bindings.put("__nodyn", this);

        NodeProcess javaProcess = new NodeProcess(this);
        getEventLoop().setProcess(javaProcess);

        try {
            engine.eval("global = this;");
            engine.eval("load(\"nashorn:mozilla_compat.js\");");

            // Adds ES6 capabilities not provided by DynJS to global scope
            loadFromClasspath(ES6_POLYFILL, global);

            // Invoke the process function
            JSObject processFunction = (JSObject) loadFromClasspath(PROCESS, global);
            JSObject jsProcess = (JSObject) processFunction.call(processFunction, javaProcess);

            Object o = loadFromClasspath(NODE_JS, global);
            JSObject nodeFunction = (JSObject) o;
            nodeFunction.call(nodeFunction, jsProcess);
        } catch (ScriptException ex) {
            Logger.getLogger(NashornRuntime.class.getName()).log(Level.SEVERE, "Cannot initialize", ex);
        }
        return javaProcess;
    }

    @Override
    protected Object runScript(String script) {
        System.out.println("Running script " + script);
        try {
            return engine.eval(new FileReader(script));
        } catch (ScriptException | FileNotFoundException ex) {
            Logger.getLogger(NashornRuntime.class.getName()).log(Level.SEVERE, null, ex);
        }
        return null;
    }

    @Override
    public Object getGlobalContext() {
        return global;
    }

    private Object loadFromClasspath(String pathName, ScriptContext context) throws ScriptException {
        System.out.println("Loading from classpath " + pathName + " in context " + context);
        // Get the source JS
        InputStream is = config.getClassLoader().getResourceAsStream(pathName);
        if (is == null) { throw new ScriptException("Path not found: " + pathName); }
        
        // eval the binding and return the result
        return engine.eval(new InputStreamReader(is), context);
    }


    class NodynJSObject extends AbstractJSObject {

        HashMap store = new HashMap();

        @Override
        public void setMember(String name, Object value) {
            store.put(name, value);
        }

        @Override
        public boolean hasMember(String name) {
            return store.containsKey(name);
        }

        @Override
        public Object getMember(String name) {
            return store.get(name);
        }
    }
}
