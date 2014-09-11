package io.nodyn;

import org.dynjs.Config;

/**
 * @author lanceball
 */
public class TestRunner {

    private static final String SCRIPT = "" +
            "var executor = require('./target/test-classes/specRunner.js');" +
            "executor.run('" + testPattern() + "');";

    public static String testPattern() {
        String pattern = System.getProperty("test.pattern");
        if (pattern == null) {
            pattern = "**/*Spec.js";
        }

        return pattern;
    }

    public static void main(String... args) throws InterruptedException {
        System.setProperty( "nodyn.binary", "./bin/nodyn" );
        //System.setProperty("javax.net.debug", "all");

        NodynConfig config = new NodynConfig(TestRunner.class.getClassLoader());
        config.setCompileMode(Config.CompileMode.OFF);
        config.setArgv(new String[]{"-e", SCRIPT});
        Nodyn nodyn = new Nodyn(config);
        nodyn.setExitHandler( new NoOpExitHandler() );
        try {
            int exitCode = nodyn.run();
            if (exitCode != 0) {
                throw new TestFailureException();
            }
        } catch (Throwable t) {
            throw new TestFailureException( t );
        }
    }
}
