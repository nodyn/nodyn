package io.nodyn.runtime.dynjs;

import io.nodyn.runtime.Program;
import org.dynjs.runtime.*;
import org.dynjs.runtime.Compiler;

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
    public Object execute(Object context) {
        if (context instanceof GlobalObject) {
            return ((GlobalObject)context).getRuntime().newRunner().withSource( this.script ).execute();
        }
        return null;
    }
}
