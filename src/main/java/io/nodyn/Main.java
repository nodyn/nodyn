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
package io.nodyn;

import org.dynjs.Config;
import org.dynjs.cli.Arguments;
import org.dynjs.runtime.DynJS;
import org.dynjs.runtime.Runner;
import org.kohsuke.args4j.CmdLineParser;
import org.kohsuke.args4j.Option;
import org.vertx.java.core.Handler;

import java.io.*;

public class Main extends org.dynjs.cli.Main {

    public static final String WELCOME_MESSAGE = "nodyn console."
            + System.lineSeparator()
            + "Type exit and press ENTER or ^D to leave."
            + System.lineSeparator();

    private NodynArguments nodynArgs;
    private CmdLineParser parser;

    public Main(PrintStream stream, String[] args) {
        super(stream, args);
        this.nodynArgs = new NodynArguments();
        this.parser = new CmdLineParser(nodynArgs);
        this.parser.setUsageWidth(80);
    }

    public static void main(String[] args) throws IOException {
        new Main(System.out, args).run();
    }

    @Override
    protected void showVersion() {
        super.showVersion();
        getOutputStream().println("Nodyn: " + Nodyn.VERSION);
    }

    @Override
    protected DynJS initializeRuntime() {

        NodynConfig config = (NodynConfig) getArguments().getConfig();
        config.setOutputStream(getOutputStream());

        if (nodynArgs.isClustered()) {
            System.setProperty("vertx.clusterManagerFactory", "org.vertx.java.spi.cluster.impl.hazelcast.HazelcastClusterManagerFactory");
            // TODO: Make this more configurable
            config.setClustered(true);
            config.setHost("localhost");
        }

        return new Nodyn(config);
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
        return this.nodynArgs;
    }

    @Override
    protected String getWelcomeMessage() {
        return WELCOME_MESSAGE;
    }

    @Override
    protected String getPrompt() {
        return "nodyn> ";
    }

    class NodynArguments extends Arguments {
        static final String CLUSTERED = "--clustered";

        @Option(name = NodynArguments.CLUSTERED, usage = "run a clustered instance on the localhost")
        private boolean isClustered = false;

        public boolean isClustered() {
            return isClustered;
        }

        @Override
        public Config getConfig() {
            return super.getConfig(new NodynConfig());
        }

    }
}
