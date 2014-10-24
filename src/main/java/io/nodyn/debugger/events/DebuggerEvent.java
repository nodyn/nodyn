package io.nodyn.debugger.events;

/**
 * @author Bob McWhirter
 */
public class DebuggerEvent {

    private final EventBody body;

    public DebuggerEvent(EventBody body) {
        this.body = body;
    }

    public int getSeq() {
        return 1;
    }

    public String getType() {
        return "event";
    }

    public String getEvent() {
        return this.body.getType();
    }

    public EventBody getBody() {
        return this.body;
    }
}
