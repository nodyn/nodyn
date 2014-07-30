package io.nodyn.contextify;

import io.nodyn.Nodyn;
import org.dynjs.runtime.*;
import org.dynjs.runtime.Compiler;

/**
 * @author Bob McWhirter
 */
public class ContextifyScriptWrap {

    private final JSProgram script;

    public ContextifyScriptWrap(Nodyn runtime, String source, String fileName, boolean displayErrors) {
        Compiler compiler = runtime.newCompiler();
        compiler.withSource(source);
        compiler.withFileName( fileName );
        try {
            this.script = compiler.compile();
        } catch (Throwable t) {
            if ( displayErrors ) {
                t.printStackTrace();
            }
            throw t;
        }
    }

    public Object runInContext(GlobalObject context) {
        return context.getRuntime().newRunner().withSource( this.script ).execute();
    }
}
