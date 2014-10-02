package io.nodyn.runtime.dynjs;

import io.nodyn.runtime.Program;
import org.dynjs.runtime.*;
import org.dynjs.runtime.Compiler;
import org.dynjs.runtime.builtins.DynJSBuiltin;

/**
 * @author Lance Ball
 */
public class DynJSProgram implements Program {

    private final JSProgram script;

    public DynJSProgram(DynJSRuntime runtime, String source, String fileName) throws Throwable {
        Compiler compiler = runtime.newCompiler();
        compiler.withSource(source);
        compiler.withFileName( fileName );
        this.script = compiler.compile();
    }

    @Override
    public Object execute(JSObject context) {
        DynJSBuiltin dynjsBuiltin = (DynJSBuiltin) context.get(null, "dynjs");
        DynJS runtime = dynjsBuiltin.getRuntime();
        return runtime.newRunner().withSource( this.script ).execute();
    }
}
