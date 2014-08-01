package io.nodyn.tcp;

import io.netty.channel.ChannelHandlerContext;
import io.nodyn.EventSource;
import io.nodyn.process.NodeProcess;


/**
 * @author Bob McWhirter
 */
public class DataEventHandler extends AbstractEventSourceHandler {

    public DataEventHandler(NodeProcess process, EventSource eventSource) {
        super(process, eventSource);
    }


    @Override
    public void channelRead(ChannelHandlerContext ctx, Object msg) throws Exception {
        emit( "data", msg );
        super.channelRead(ctx, msg);
    }
}
