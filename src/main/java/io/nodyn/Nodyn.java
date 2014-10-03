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

import io.nodyn.loop.EventLoop;
import io.nodyn.runtime.Config;
import io.nodyn.runtime.Program;
import org.vertx.java.core.Vertx;

/**
 * @author Lance Ball
 */
public interface Nodyn {
    static final String NODE_JS = "node.js";
    static final String PROCESS = "nodyn/process.js";
    static final String ES6_POLYFILL = "nodyn/polyfill.js";

    String VERSION = "0.1.1-SNAPSHOT"; // TODO: This should come from pom.xml

    void setExitHandler(ExitHandler handle);

    ExitHandler getExitHandler();

    void reallyExit(int exitCode);

    EventLoop getEventLoop();

    Vertx getVertx();

    int run() throws Throwable;

    Object loadBinding(String name);

    Program compile(String source, String fileName, boolean displayErrors) throws Throwable;

    Config getConfiguration();
}
