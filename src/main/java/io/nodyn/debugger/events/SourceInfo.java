package io.nodyn.debugger.events;

/**
 * @author Bob McWhirter
 */
public class SourceInfo {

    private final int line;
    private final int column;
    private final String text;

    public SourceInfo(int line, int column, String text) {
        this.line = line;
        this.column = column;
        this.text = text;
    }

    public int getLine() {
        return this.line;
    }

    public int getColumn() {
        return this.column;
    }

    public String getText() {
        return this.text;
    }
}
