/**
 *  Copyright 2013 Douglas Campos, and individual contributors
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 * 	http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */
package org.projectodd.nodyn;

import org.dynjs.Config;
import org.dynjs.cli.Arguments;
import org.dynjs.cli.Repl;
import org.dynjs.runtime.DynJS;
import org.dynjs.runtime.DynObject;
import org.dynjs.runtime.GlobalObject;
import org.dynjs.runtime.Runner;
import org.kohsuke.args4j.CmdLineException;
import org.kohsuke.args4j.CmdLineParser;
import org.projectodd.nodyn.buffer.BufferType;
import org.projectodd.nodyn.util.QueryString;
import org.vertx.java.core.Vertx;
import org.vertx.java.core.VertxFactory;

import java.io.*;

public class Main {

    private Arguments dynJsArguments;
    private CmdLineParser parser;
    private String[] arguments;
    private PrintStream stream;
    private Config config;
    private DynJS runtime;

    public Main(PrintStream stream, String[] args) {
        this.dynJsArguments = new Arguments();
        this.parser = new CmdLineParser(dynJsArguments);
        this.parser.setUsageWidth(80);
        this.arguments = args;
        this.stream = stream;
    }

    public static void main(String[] args) throws IOException {
        new Main(System.out, args).run();
    }

    void run() throws IOException {
        try {
            parser.parseArgument(arguments);

            if (dynJsArguments.isHelp() || dynJsArguments.isEmpty()) {
                showUsage();
            } else if (dynJsArguments.getFilename() != null) {
                executeFile(dynJsArguments.getFilename());
            } else if (dynJsArguments.isConsole()) {
                startRepl();
            } else if (dynJsArguments.isVersion()) {
                showVersion();
            }

        } catch (CmdLineException e) {
            stream.println(e.getMessage());
            stream.println();
            showUsage();
        }
    }

    private void executeFile(String filename) throws IOException {
        try {
            initializeRuntime();
            runtime.newRunner().withSource(new File(filename)).execute();
        } catch (FileNotFoundException e) {
            stream.println("File " + filename + " not found");
        }
    }

    private void showVersion() {
        stream.println("dynjs " + DynJS.VERSION);
    }

    private void startRepl() {
        initializeRuntime();
        Repl repl = new Repl(runtime, System.in, stream, "Welcome to nodyn. ^D to exit.", "nodyn> ");
        repl.run();
    }

    private void showUsage() {
        StringBuilder usageText = new StringBuilder("Usage: nodyn [--console |--debug | --help | --version |FILE]\n");
        usageText.append("Starts the nodyn console or executes FILENAME depending the parameters\n");
        stream.println(usageText.toString());
        parser.printUsage(stream);
    }
    
    private void initializeRuntime() {
        config = dynJsArguments.getConfig();
        config.setOutputStream(this.stream);
        runtime = new DynJS(config);
        Vertx vertx = VertxFactory.newVertx();
        GlobalObject globalObject = runtime.getExecutionContext().getGlobalObject();
        globalObject.defineGlobalProperty("__jvertx", vertx);

        BufferType bufferType = new BufferType(globalObject);
        DynObject node = new DynObject(globalObject);
        node.put("buffer", bufferType);

        node.put("QueryString", new QueryString(globalObject));

        globalObject.defineGlobalProperty("nodyn", node);
        globalObject.defineGlobalProperty("global", globalObject);
        globalObject.defineGlobalProperty("__filename", "repl");

        InputStream is = runtime.getConfig().getClassLoader().getResourceAsStream("node.js");
        if (is != null) {
            BufferedReader reader = new BufferedReader(new InputStreamReader(is));
            runtime.newRunner().withSource(reader).evaluate();
            try {
                is.close();
            } catch (IOException e) {
                // ignore
            }
        } else {
            System.err.println("[ERROR] Cannot initialize Nodyn.");
        }

    }
}
