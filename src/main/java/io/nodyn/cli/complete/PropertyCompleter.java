package io.nodyn.cli.complete;

import org.dynjs.runtime.*;
import org.jboss.aesh.complete.CompleteOperation;
import org.jboss.aesh.complete.Completion;

import java.util.List;

/**
 * @author Bob McWhirter
 */
public class PropertyCompleter implements Completion {

    private final DynJS runtime;

    public PropertyCompleter(DynJS runtime) {
        this.runtime = runtime;
    }

    @Override
    public void complete(CompleteOperation completeOperation) {

        String buffer = completeOperation.getBuffer();

        String prefix = buffer;

        Object current = null;

        int lastDotLoc = buffer.lastIndexOf('.');
        if ( lastDotLoc < 0 ) {
            current = this.runtime.getGlobalObject();
        } else {
            String context = buffer.substring(0, lastDotLoc );
            if ( context.contains( "(" ) ) {
                return;
            }
            prefix = buffer.substring( lastDotLoc+1 );

            current = this.runtime.evaluate( context );
        }

        if ( current instanceof JSObject) {
            List<String> names = ((JSObject) current).getAllEnumerablePropertyNames().toList();
            for ( String each : names ) {
                if ( each.startsWith(prefix) ) {
                    Object value = ((JSObject) current).get(this.runtime.getExecutionContext(), each);
                    if ( ! ( value instanceof JSFunction ) ) {
                        //System.err.println( "property: " + each );
                        completeOperation.setSeparator('.');
                        completeOperation.doAppendSeparator(false);
                        completeOperation.setOffset(completeOperation.getCursor() - prefix.length());
                        completeOperation.addCompletionCandidate(each);
                    }
                 }
            }
        }
    }
}
