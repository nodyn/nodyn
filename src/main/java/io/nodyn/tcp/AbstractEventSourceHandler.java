package io.nodyn.tcp;

import io.netty.channel.ChannelDuplexHandler;
import io.netty.channel.ChannelHandlerContext;
import io.nodyn.CallbackResult;
import io.nodyn.EventSource;
import io.nodyn.net.NetServerWrap;
import io.nodyn.net.SocketWrap;
import io.nodyn.net.SocketWrappingHandler;
import io.nodyn.process.NodeProcess;

/**
 * @author Bob McWhirter
 */
public class AbstractEventSourceHandler extends ChannelDuplexHandler {

    protected final NodeProcess process;
    protected final EventSource eventSource;

    public AbstractEventSourceHandler(NodeProcess process, EventSource eventSource) {
        this.process = process;
        this.eventSource = eventSource;
    }

    public void emit(String event) {
         this.eventSource.emit( event, CallbackResult.EMPTY_SUCCESS );
    }

    public void emit(String event, Object value) {
        this.eventSource.emit( event, CallbackResult.createSuccess( value ) );
    }
    
    public void emit(String event, Object...values) {
        this.eventSource.emit( event, CallbackResult.createSuccess( values ) );
    }
}
