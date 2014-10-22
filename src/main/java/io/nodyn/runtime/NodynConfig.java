package io.nodyn.runtime;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

/**
 * @author Bob McWhirter
 */
public class NodynConfig {

    private final NodynClassLoader classLoader;
    private String evalString;
    private boolean help;
    private boolean version;
    private boolean print;
    private boolean interactive;

    private boolean noDeprecation;
    private boolean traceDeprecation;
    private boolean throwDeprecation;

    private List<String> execArgv = new ArrayList<>();

    private boolean debug;
    private int debugPort;

    private boolean noMoreArgs;

    public NodynConfig() {
        this.classLoader = new NodynClassLoader();
    }

    public NodynConfig(String[] rawArgv) {
        this();
        parse( rawArgv );
    }

    public String toString() {
        return "[NodynConfig: evalString=" + this.evalString + "; help=" + this.help + "; version=" + this.version + "; print=" + this.print + "; interactive=" + this.interactive + "; execArgv=" + this.execArgv + "]";

    }

    public NodynClassLoader getClassLoader() {
        return this.classLoader;
    }

    private boolean shouldStop() {
        return this.help || this.version;
    }

    public boolean getPrint() {
        return this.print;
    }

    public boolean isHelp() {
        return this.help;
    }

    public boolean isVersion() {
        return this.version;
    }

    public boolean isDebug() {
        return this.debug;
    }

    public int getDebugPort() {
        return this.debugPort;
    }

    public boolean getInteractive() {
        return this.interactive;
    }

    public boolean getNoDeprecation() {
        return this.noDeprecation;
    }

    public boolean getTraceDeprecation() {
        return this.traceDeprecation;
    }

    public boolean getThrowDeprecation() {
        return this.throwDeprecation;
    }

    public String[] getExecArgv() {
        return this.execArgv.toArray(new String[this.execArgv.size()]);
    }

    public String getEvalString() {
        return this.evalString;
    }

    protected void parse(String[] rawArgv) {

        int i = 0;

        while (i < rawArgv.length && ! shouldStop()) {
            i = parse( rawArgv, i );
        }

    }

    protected int parse(String[] rawArgv, int pos) {
        String arg = rawArgv[pos];

        if ( this.noMoreArgs ) {
            this.execArgv.add( arg );
            return pos+1;
        }

        int result = parseDebug(rawArgv, pos );
        if ( result != pos ) {
            return result;
        }

        switch ( arg ) {
            case "-v":
            case "--version":
                this.version = true;
                return pos+1;
            case "--help":
                this.help = true;
                return pos+1;
            case "-e":
            case "--eval":
                this.evalString = next( rawArgv, pos );
                return pos+2;
            case "-p":
            case "-pe":
            case "--print":
                this.evalString = next( rawArgv, pos );
                this.print = true;
                return pos+2;
            case "-i":
            case "--interactive":
                this.interactive = true;
                return pos+1;
            case "--no-deprecation":
                this.noDeprecation = true;
                return pos+1;
            case "--trace-deprecation":
                this.traceDeprecation = true;
                return pos+1;
            case "--throw-deprecation":
                this.throwDeprecation = true;
                return pos+1;
            default:
                this.noMoreArgs = true;
                return pos;
        }
    }

    protected int parseDebug(String[] rawArgv, int pos) {
        String arg = rawArgv[pos];

        if ( arg.equals( "--debug") ) {
            this.debug = true;
            return pos+1;
        }

        if ( arg.startsWith( "--debug=" ) ) {
            try {
                this.debugPort = Integer.parseInt(arg.substring("--debug=".length()));
                this.debug = true;
            } catch (NumberFormatException e) {
                // ignore
            }
            return pos+1;
        }

        if ( arg.startsWith( "--debug-port=" ) ) {
            try {
                this.debugPort = Integer.parseInt(arg.substring("--debug-port=".length()));
                this.debug = true;
            } catch (NumberFormatException e) {
                // ignore
            }
            return pos+1;
        }

        return pos;
    }

    protected String next(String[] rawArgv, int pos) {
        if ( ( pos + 1 )  >=  rawArgv.length ) {
            throw new IllegalArgumentException( rawArgv[pos] + " requires an argument" );
        }

        return  rawArgv[pos+1];

    }

}
