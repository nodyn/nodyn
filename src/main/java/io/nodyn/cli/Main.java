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

package io.nodyn.cli;

import io.nodyn.Nodyn;
import io.nodyn.runtime.NodynConfig;
import io.nodyn.runtime.RuntimeFactory;

import java.io.File;
import java.io.IOException;

public class Main {

    private NodynConfig config;
    private Nodyn nodyn;

    public Main(String[] args) {
        this.config = new NodynConfig(args);
    }

    public static void main(String[] args) throws IOException, InterruptedException {
        int exitCode = new Main(args).run();
        System.exit(exitCode);
    }

    public int run() {
        if (config.isHelp()) {
            return runHelp();
        } else if (config.isVersion()) {
            return runVersion();
        } else {
            return runNormal();
        }
    }

    protected int runHelp() {
        System.err.println("" +
                "Usage: node [options] [ -e script | script.js ] [arguments] \n" +
                "       node debug script.js [arguments] \n" +
                "\n" +
                "Options:\n" +
                "  -v, --version        print node's version\n" +
                "  -e, --eval script    evaluate script\n" +
                "  -p, --print          evaluate script and print result\n" +
                "  -i, --interactive    always enter the REPL even if stdin\n" +
                "                       does not appear to be a terminal\n" +
                "  --no-deprecation     silence deprecation warnings\n" +
                "  --throw-deprecation  throw an exception anytime a deprecated " +
                "function is used\n" +
                "  --trace-deprecation  show stack traces on deprecations\n" +
                "  --v8-options         print v8 command line options\n" +
                "  --max-stack-size=val set max v8 stack size (bytes)\n" +
                "\n" +
                "Environment variables:\n" +
                "NODE_PATH              '" + File.pathSeparator + "'-separated list of directories\n" +
                "                       prefixed to the module search path.\n" +
                "NODE_MODULE_CONTEXTS   Set to 1 to load modules in their own\n" +
                "                       global contexts.\n" +
                "NODE_DISABLE_COLORS    Set to 1 to disable colors in the REPL\n" +
                "\n" +
                "Documentation can be found at http://nodejs.org/\n");
        return 0;
    }

    protected int runVersion() {
        System.err.println( "v" + Nodyn.NODE_VERSION + " (v" + Nodyn.VERSION + ")" );
        return 0;
    }

    protected int runNormal() {
        RuntimeFactory factory = RuntimeFactory.init(this.config.getClassLoader(), RuntimeFactory.RuntimeType.NASHORN);
        this.nodyn = factory.newRuntime(config);
        try {
            return this.nodyn.run();
        } catch (Throwable t) {
            this.nodyn.handleThrowable(t);
        }

        return -255;
    }
}
