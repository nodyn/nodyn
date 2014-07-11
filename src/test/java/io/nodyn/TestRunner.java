package io.nodyn;

import io.nodyn.cli.Arguments;
import io.nodyn.cli.Runtime;
import org.jasmine.cli.CliNotifier;
import org.jasmine.cli.JVM;

/**
 * @author lanceball
 */
public class TestRunner {
    public static void main(String... args){
        Arguments arguments = Arguments.parse(args);

        Runtime.Builder builder = new Runtime.Builder();
        arguments.compileMode().apply(builder);
        builder.specs(arguments.specs());
        builder.build().execute(new CliNotifier(System.out, new JVM(), arguments.formatter()));
    }
}
