package io.nodyn.debugger.events;

/**
 * @author Bob McWhirter
 */
public class ScriptInfo {

    private final String name;
    private final int lineOffSet;
    private final int columnOffSet;
    private final int lineCount;

    public ScriptInfo(String name, int lineOffSet, int columnOffSet, int lineCount) {
        this.name = name;
        this.lineOffSet = lineOffSet;
        this.columnOffSet = columnOffSet;
        this.lineCount = lineCount;
    }

    public String getName() {
        return this.name;
    }

    public int getLineOffSet() {
        return this.lineOffSet;
    }

    public int getColumnOffSet() {
        return this.columnOffSet;
    }

    public int getLineCount() {
        return this.lineCount;
    }
}
