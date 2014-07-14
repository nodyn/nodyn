package io.nodyn.cli;

import io.nodyn.NodynConfig;
import org.dynjs.Config;
import org.kohsuke.args4j.Argument;
import org.kohsuke.args4j.Option;
import org.kohsuke.args4j.spi.MultiFileOptionHandler;

import java.io.File;
import java.net.MalformedURLException;
import java.util.ArrayList;
import java.util.List;

/**
 * @author lanceball
 */
public class NodynArguments {
    static final String CONSOLE = "--console";
    static final String HELP = "--help";
    static final String VERSION = "--version";
    static final String DEBUG = "--debug";
    static final String FILE = "--file";
    static final String EVAL = "--eval";
    static final String PROPERTIES = "--properties";
    static final String CLASSPATH = "--classpath";
    static final String CLUSTERED = "--clustered";

    public static final String VERSION_SHORT = "-v";
    public static final String HELP_SHORT = "-h";
    public static final String CLASSPATH_SHORT = "-cp";
    public static final String EVAL_SHORT = "-e";

    @Option(name = CONSOLE, usage = "Opens a REPL console.")
    private boolean console;

    @Option(name = HELP, aliases = {HELP_SHORT}, usage = "Shows this help screen.")
    private boolean help;

    @Option(name = VERSION, aliases = {VERSION_SHORT}, usage = "Shows the nodyn version.")
    private boolean version;

    @Option(name = DEBUG, usage = "Enables debug mode.")
    private boolean debug;

    @Option(name = PROPERTIES, usage = "Shows config properties.")
    private boolean properties;

    @Option(name = CLASSPATH, aliases = {CLASSPATH_SHORT}, handler = MultiFileOptionHandler.class, usage = "Append items to classpath")
    private List<File> classpath = new ArrayList<>();

    @Option(name = NodynArguments.CLUSTERED, usage = "run a clustered instance on the localhost")
    private boolean isClustered = false;

    @Option(name = EVAL, aliases = {EVAL_SHORT}, usage = "Evaluates the given expression", metaVar = "EXPR")
    private String eval = "";

    @Argument(usage = "Arguments", required = false, metaVar = "ARGS")
    private List<String> arguments = new ArrayList<>();

    public Config getConfig() {
        return this.initConfig(new NodynConfig());
    }

    protected Config initConfig(Config config) {
        if (this.isDebug()) {
            config.setDebug(true);
        }
        config.setArgv(arguments.toArray());
        if (!getClasspath().isEmpty()) {
            for (File file : getClasspath()) {
                try {
                    config.getClasspath().push(file.getAbsolutePath());
                } catch (MalformedURLException e) {
                    throw new IllegalArgumentException(e);
                }
            }
        }
        return config;
    }

    public boolean isConsole() {
        return console;
    }

    public boolean isHelp() {
        return help;
    }

    public boolean isVersion() {
        return version;
    }

    public boolean isDebug() {
        return debug;
    }

    public boolean isProperties() {
        return properties;
    }

    public String getFilename() {
        if (arguments.size() > 0) {
            return arguments.get(0);
        } else {
            return null;
        }
    }

    public List<File> getClasspath() { return classpath; }

    public String getEval() { return this.eval; }

    public boolean isClustered() { return isClustered; }

}
