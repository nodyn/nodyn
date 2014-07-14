package io.nodyn.cli.complete;

import org.dynjs.runtime.DynJS;
import org.dynjs.runtime.JSFunction;
import org.dynjs.runtime.JSObject;
import org.jboss.aesh.complete.CompleteOperation;
import org.jboss.aesh.complete.Completion;

import java.util.List;

/**
 * @author Bob McWhirter
 */
public class KeywordCompleter implements Completion {

    private static final String[] KEYWORDS = new String[] {
            "var",
            "function",
    };

    public KeywordCompleter() {

    }

    @Override
    public void complete(CompleteOperation completeOperation) {
        String buffer = completeOperation.getBuffer();

        String prefix = buffer;

        int lastOpenCurly = buffer.lastIndexOf( '{' );

        if ( lastOpenCurly >= 0 ) {
            int lastClosedCurly = buffer.lastIndexOf('}');
            if ( lastClosedCurly > lastOpenCurly ) {
                return;
            }

            prefix = buffer.substring( lastOpenCurly + 1 );
        }

        prefix = prefix.trim();

        for ( String each : KEYWORDS ) {
            if ( each.startsWith( prefix ) ) {
                completeOperation.addCompletionCandidate( each );
                completeOperation.setSeparator( ' ' );
                completeOperation.setOffset(completeOperation.getCursor() - prefix.length());
            }
        }
    }
}
