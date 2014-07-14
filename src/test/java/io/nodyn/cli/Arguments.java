package io.nodyn.cli;

import org.jasmine.SpecScanner;
import org.jasmine.cli.Formatter;
import org.kohsuke.args4j.*;
import org.kohsuke.args4j.spi.EnumOptionHandler;
import org.kohsuke.args4j.spi.Setter;

import java.util.ArrayList;
import java.util.List;

/**
 * @author lanceball
 */
public class Arguments {

    public static class CompileModeEnumOptionHandler extends EnumOptionHandler<CompileMode> {
        public CompileModeEnumOptionHandler(CmdLineParser parser, OptionDef option, Setter<? super CompileMode> setter) {
            super(parser, option, setter, CompileMode.class);
        }
    }

    public static class OutputFormatEnumOptionHandler extends EnumOptionHandler<OutputFormat> {
        public OutputFormatEnumOptionHandler(CmdLineParser parser, OptionDef option, Setter<? super OutputFormat> setter) {
            super(parser, option, setter, OutputFormat.class);
        }
    }


    public static Arguments parse(String... args) {
        Arguments arguments = new Arguments();
        CmdLineParser parser = new CmdLineParser(arguments);
        try {
            parser.parseArgument(args);
        } catch (CmdLineException e) {
            throw new RuntimeException(e);
        }
        return arguments;
    }

    @Option(name = "--pattern")
    private String pattern;

    @Option(name = "--compile-mode", handler = CompileModeEnumOptionHandler.class)
    private CompileMode compileMode = CompileMode.JIT;

    @Option(name = "--format", handler = OutputFormatEnumOptionHandler.class)
    private OutputFormat format = OutputFormat.PROGRESS;


    @Argument
    private List<String> arguments = new ArrayList<String>();

    public Iterable<String> specs(){
        if(pattern != null){
            return new SpecScanner().findSpecs(pattern);
        }else{
            return arguments;
        }
    }

    public CompileMode compileMode() {
        return compileMode;
    }

    public Formatter formatter() {
        return format.formatter();
    }
}
