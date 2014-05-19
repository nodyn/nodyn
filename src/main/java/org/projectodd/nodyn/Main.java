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

import org.dynjs.cli.Arguments;
import org.dynjs.runtime.DynJS;
import org.dynjs.runtime.DynObject;
import org.dynjs.runtime.ExecutionContext;
import org.dynjs.runtime.GlobalObject;
import org.kohsuke.args4j.CmdLineParser;
import org.kohsuke.args4j.Option;
import org.projectodd.nodyn.util.QueryString;
import org.vertx.java.core.Vertx;
import org.vertx.java.core.VertxFactory;

import java.io.*;

public class Main extends org.dynjs.cli.Main {

    public static final String WELCOME_MESSAGE = "nodyn console."
            + System.lineSeparator()
            + "Type exit and press ENTER or ^D to leave."
            + System.lineSeparator();

    private NodynArguments arguments;
    private CmdLineParser parser;
    private Vertx vertx;

    public Main(PrintStream stream, String[] args) {
        super(stream, args);
        this.arguments = new NodynArguments();
        this.parser = new CmdLineParser(arguments);
        this.parser.setUsageWidth(80);
    }

    public static void main(String[] args) throws IOException {
        new Main(System.out, args).run();
    }

    @Override
    protected void showVersion() {
        super.showVersion();
        getOutputStream().println("Nodyn: " + Node.VERSION);
    }

    @Override
    protected DynJS initializeRuntime() {
        DynJS runtime = super.initializeRuntime();

        if (arguments.isClustered()) {
            System.setProperty("vertx.clusterManagerFactory", "org.vertx.java.spi.cluster.impl.hazelcast.HazelcastClusterManagerFactory");
            // TODO: Make this more configurable
            vertx = VertxFactory.newVertx("localhost");
        } else {
            vertx = VertxFactory.newVertx();
        }

        GlobalObject globalObject = runtime.getExecutionContext().getGlobalObject();
        globalObject.defineGlobalProperty("__dirname", System.getProperty("user.dir"));
        globalObject.defineGlobalProperty("__filename", "repl"); // TODO: This should be a file name sometimes
        initScript(runtime.getExecutionContext(), "node.js", runtime);
        return runtime;
    }

    @Override
    protected String getBinaryName() {
        return "nodyn";
    }

    @Override
    protected CmdLineParser getParser() {
        return this.parser;
    }

    @Override
    protected Arguments getArguments() {
        return this.arguments;
    }

    @Override
    protected String getWelcomeMessage() {
        return WELCOME_MESSAGE;
    }

    @Override
    protected String getPrompt() {
        return "nodyn> ";
    }

    private static void initScript(ExecutionContext context, String name, DynJS runtime) {
        InputStream is = runtime.getConfig().getClassLoader().getResourceAsStream(name);
        if (is != null) {
            BufferedReader reader = new BufferedReader(new InputStreamReader(is));
            runtime.newRunner().withContext(context).withSource(reader).evaluate();
            try {
                is.close();
            } catch (IOException e) {
                // ignore
            }
        } else {
            System.err.println("[ERROR] Cannot initialize Nodyn.");
        }
    }

    class NodynArguments extends Arguments {
        static final String CLUSTERED = "--clustered";

        @Option(name = NodynArguments.CLUSTERED, usage = "run a clustered instance on the localhost")
        private boolean isClustered = false;

        public boolean isClustered() {
            return isClustered;
        }
    }
}
