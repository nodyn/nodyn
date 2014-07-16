/**
 *  Copyright 2013 Red Hat, Inc. and individual contributors
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
package io.nodyn.cli;

import io.nodyn.Nodyn;
import io.nodyn.NodynConfig;
import io.nodyn.loop.RefHandle;
import org.dynjs.cli.Options;
import org.dynjs.exception.ThrowException;
import org.dynjs.runtime.Runner;
import org.kohsuke.args4j.CmdLineException;
import org.kohsuke.args4j.CmdLineParser;
import org.kohsuke.args4j.OptionHandlerFilter;

import java.io.*;

public class Main {

    public static final String PROMPT = "nodyn> ";
    public static final String BINARY = "nodyn";
    public static final String WELCOME_MESSAGE = "nodyn console."
            + System.lineSeparator()
            + "Type exit and press ENTER or ^D to leave."
            + System.lineSeparator();

    private NodynArguments nodynArgs;
    private CmdLineParser parser;
    private String[] arguments;
    private PrintStream stream;
    private Nodyn nodyn;

    public Main(PrintStream stream, String[] args) {
        this.arguments = args;
        this.stream = stream;

        this.nodynArgs = new NodynArguments();
        this.parser = new CmdLineParser(nodynArgs);
        this.parser.setUsageWidth(80);
    }

    public static void main(String[] args) throws IOException {
        new Main(System.out, args).run();
    }

    public void run() throws IOException {
        try {
            if (arguments.length == 0) {
                arguments = new String[]{"--console"};
            }
            getParser().parseArgument(arguments);

            // short circuit options
            if (getArguments().isHelp()) {
                showUsage();
                return;
            } else if (getArguments().isProperties()) {
                showProperties();
                return;
            } else if (getArguments().isVersion()) {
                showVersion();
                return;
            }

            if (getArguments().isConsole()) {
                startRepl();
                return;
            }

            if (!getArguments().getEval().isEmpty()) {
                executeSource(getArguments().getEval());
                return;
            } else if (getArguments().getFilename() != null) {
                // node.js will use process.argv[1] to load the
                // main .js file using Module._load. It's not
                // totally clear to me if unref() here is correct.
                // I think it should be, because we only need to run
                // as long as the script holds a reference. It will
                // only hold a reference if it does some async stuff
                // which creates a new reference anyway. If it doesn't
                // do async stuff, no need to wait around after the
                // script has executed.
                RefHandle start = null;
                try {
                    start = getRuntime().start();
                } catch (ThrowException e) {
                    System.err.println(e.getMessage());
                    e.printStackTrace();
                } finally {
                    if (start != null) start.unref();
                }
                return;
            } else {
                getOutputStream().println("please specify source to eval or file");
            }

            // last resort, show usage
            showUsage();


        } catch (CmdLineException e) {
            getOutputStream().println(e.getMessage());
            getOutputStream().println();
            showUsage();
        }
    }

    private void executeSource(String eval) {
        getRuntime().start(getRuntime().newRunner().withSource(eval));
    }

    private void showProperties() {
        StringBuilder sb = new StringBuilder();
        sb
                .append("# These properties can be used to alter runtime behavior for perf or compatibility.\n")
                .append("# Specify them by passing directly to Java -Ddynjs.<property>=<value>\n");
        getOutputStream().print(sb.toString());
        getOutputStream().println(com.headius.options.Option.formatOptions(Options.PROPERTIES));
    }

    private void executeFile(File file) throws IOException {
        try {
            getRuntime().start(getRuntime().newRunner().withSource(file));
        } catch (FileNotFoundException e) {
            getOutputStream().println("File " + file.getName() + " not found");
        }
    }

    private void showUsage() {
        getOutputStream().println("usage: " + BINARY + getParser().printExample(OptionHandlerFilter.ALL, null) + "\n");
        getParser().printUsage(getOutputStream());
    }

    private void startRepl() {
        //RefHandle handle = getRuntime().start(); // No top level script for repl. Just start it up.
        //NodynRepl repl = new NodynRepl(handle, getRuntime(), System.in, getOutputStream(), WELCOME_MESSAGE, PROMPT, System.getProperty("user.dir") + "/nodyn.log");
        //repl.run();
        Runner runner = getRuntime().newRunner();
        InputStream repl = getRuntime().getConfig().getClassLoader().getResourceAsStream("node_repl.js");
        BufferedReader in = new BufferedReader(new InputStreamReader(repl));
        runner.withSource( in );
        getRuntime().start( runner );
    }

    private PrintStream getOutputStream() {
        return stream;
    }

    private void showVersion() {
        getOutputStream().println("Nodyn: " + Nodyn.VERSION);
    }

    private Nodyn getRuntime() {
        if (nodyn == null) {
            NodynConfig config = (NodynConfig) getArguments().getConfig();
            config.setOutputStream(getOutputStream());

            if (getArguments().isClustered()) {
                System.setProperty("vertx.clusterManagerFactory", "org.vertx.java.spi.cluster.impl.hazelcast.HazelcastClusterManagerFactory");
                // TODO: Make this more configurable
                config.setClustered(true);
                config.setHost("localhost");
            }
            nodyn = new Nodyn(config);
        }
        return nodyn;
    }

    private CmdLineParser getParser() {
        return this.parser;
    }

    private NodynArguments getArguments() {
        return this.nodynArgs;
    }

}
