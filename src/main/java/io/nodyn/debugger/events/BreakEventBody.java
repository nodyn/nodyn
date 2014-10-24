package io.nodyn.debugger.events;

/**
 * @author Bob McWhirter
 */
public class BreakEventBody extends EventBody {

    private final String invocationText;

    public BreakEventBody(String invocationText, SourceInfo source, ScriptInfo script) {
        super( "break", source, script );
        this.invocationText = invocationText;
    }

    public String getInvocationText() {
        return this.invocationText;
    }
}
