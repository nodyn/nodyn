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
import io.nodyn.runtime.Config;
import io.nodyn.runtime.Program;
import org.vertx.java.core.Vertx;

/**
 * @author Lance Ball
 */
public class NashornRuntime extends Nodyn {

    public NashornRuntime(Config config, Vertx vertx, boolean controlLifeCycle) {
        super(config, vertx, controlLifeCycle);
    }

    @Override
    public Object loadBinding(String name) {
        return null;
    }

    @Override
    public Program compile(String source, String fileName, boolean displayErrors) throws Throwable {
        return null;
    }

    @Override
    public void makeContext(Object global) {

    }

    @Override
    public boolean isContext(Object global) {
        return false;
    }

    @Override
    public void handleThrowable(Throwable t) {

    }

    @Override
    protected NodeProcess initialize() {
        return null;
    }

    @Override
    protected Object runScript(String script) {
        return null;
    }

    @Override
    public Object getGlobalContext() {
        return null;
    }

}
