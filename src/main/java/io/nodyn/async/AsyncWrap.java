package io.nodyn.async;

import io.netty.channel.EventLoopGroup;
import io.nodyn.CallbackResult;
import io.nodyn.EventSource;
import io.nodyn.process.NodeProcess;

/**
 * @author Bob McWhirter
 */
public class AsyncWrap extends EventSource {

    protected final NodeProcess process;

    public AsyncWrap(NodeProcess process) {
        this.process = process;
    }

    protected EventLoopGroup getEventLoopGroup() {
        return this.process.getEventLoop().getEventLoopGroup();
    }

    public NodeProcess getProcess() {
        return this.process;
    }

    public void makeCallback(int index) {
        emit("makeCallbackByIndex", CallbackResult.createSuccess( index ) );
    }
}
