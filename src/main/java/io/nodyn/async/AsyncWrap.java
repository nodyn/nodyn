package io.nodyn.async;

import io.nodyn.CallbackResult;
import io.nodyn.EventSource;
import io.nodyn.process.NodeProcess;

/**
 * @author Bob McWhirter
 */
public class AsyncWrap extends EventSource {

    private final NodeProcess process;

    public AsyncWrap(NodeProcess process) {
        this.process = process;
    }

    public void makeCallback(int index) {
        emit("makeCallbackByIndex", CallbackResult.createSuccess( index ) );
    }
}
