package io.nodyn;

import org.dynjs.Config;
import org.jasmine.cli.JVM;

/**
 * @author lanceball
 */
public class TestRunner {

    private static final String SCRIPT = "" +
            "var executor = require('./target/test-classes/specRunner.js');" +
            "var jvm = new io.nodyn.NodynJVM(process._process);" +
            "var formatter = new org.jasmine.cli.DocumentationFormatter();" +
            "var notifier = new org.jasmine.cli.CliNotifier(System.out, jvm, formatter);" +
            "var specs = new java.util.ArrayList();" +
            "var scanner = new org.jasmine.SpecScanner();" +
            "var iter = scanner.findSpecs('" + testPattern() + "').iterator();" +
            "while ( iter.hasNext() ) {" +
            "  var file = new java.io.File( iter.next() );" +
            "  specs.add( file.absolutePath );" +
            "}" +
            "executor.execute(specs, notifier);" +
            "executor.run();";

    public static String testPattern() {
        String pattern = System.getProperty("test.pattern");
        if (pattern == null) {
            pattern = "**/*Spec.js";
        }

        return pattern;
    }

    public static void main(String... args) throws InterruptedException {
        NodynConfig config = new NodynConfig(TestRunner.class.getClassLoader());
        config.setCompileMode(Config.CompileMode.OFF);
        config.setArgv(new String[]{"-e", SCRIPT});
        Nodyn nodyn = new Nodyn(config);
        int exitCode = nodyn.run();
        if ( exitCode != 0 ) {
            throw new TestFailureException();
        }
    }
}
