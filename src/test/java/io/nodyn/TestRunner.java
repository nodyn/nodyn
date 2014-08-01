package io.nodyn;

import org.dynjs.Config;

/**
 * @author lanceball
 */
public class TestRunner {

    private static final String SCRIPT = "" +
            "var executor = require('./target/test-classes/specRunner.js');" +
            "var jvm = new org.jasmine.cli.JVM();" +
            "var formatter = new org.jasmine.cli.DocumentationFormatter();" +
            "var notifier = new org.jasmine.cli.CliNotifier(System.out, jvm, formatter);" +
            "var specs = new java.util.ArrayList();" +
            "var scanner = new org.jasmine.SpecScanner();" +
            "var iter = scanner.findSpecs('" + System.getProperty( "test.pattern" ) + "').iterator();" +
            "while ( iter.hasNext() ) {" +
            "  var file = new java.io.File( iter.next() );" +
            "  specs.add( file.absolutePath );" +
            "}" +
            "executor.execute(specs, notifier);" +
            "executor.run();";

    public static void main(String... args) {
        NodynConfig config = new NodynConfig(TestRunner.class.getClassLoader());
        config.setCompileMode(Config.CompileMode.OFF);
        config.setArgv(new String[]{"-e", SCRIPT});
        Nodyn nodyn = new Nodyn(config);
        nodyn.run();
    }
}
