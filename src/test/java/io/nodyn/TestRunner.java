package io.nodyn;

import org.jasmine.Runtime;
import org.jasmine.cli.Arguments;
import org.jasmine.cli.CliNotifier;
import org.jasmine.cli.JVM;

/**
 * @author lanceball
 */
public class TestRunner {
    public static void main(String... args){
        Arguments arguments = Arguments.parse(args);

        org.jasmine.Runtime.Builder builder = new Runtime.Builder();
        arguments.compileMode().apply(builder);
        builder.specs(arguments.specs());

        builder.build().execute(new CliNotifier(System.out, new JVM()));
    }
}
