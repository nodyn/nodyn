package io.nodyn.debugger.events;

/**
 * @author Bob McWhirter
 */
public class EventBody {

    private String type;
    private final SourceInfo source;
    private final ScriptInfo script;

    public EventBody(String type, SourceInfo source, ScriptInfo script) {
        this.type = type;
        this.source = source;
        this.script = script;
    }

    String getType() {
        return this.type;
    }

    public int getSourceLine() {
        return this.source.getLine();
    }

    public int getSourceColumn() {
        return this.source.getColumn();
    }

    public String getSourceText() {
        return this.source.getText();
    }

    public ScriptInfo getScript() {
        return this.script;
    }
}
