package io.nodyn.tcp;

import io.netty.channel.ChannelHandlerContext;
import io.nodyn.EventSource;
import io.nodyn.process.NodeProcess;


/**
 * @author Bob McWhirter
 */
public class AfterConnectEventHandler extends AbstractEventSourceHandler {

    public AfterConnectEventHandler(NodeProcess process, EventSource eventSource) {
        super(process, eventSource);
    }

    @Override
    public void channelActive(ChannelHandlerContext ctx) throws Exception {
        TCPWrap clientHandle = new TCPWrap( this.process, ctx.channel().newSucceededFuture() );
        ctx.pipeline().addAfter(ctx.name(), "emit.data", new DataEventHandler(this.process, clientHandle));
        emit("afterConnect", clientHandle );
        super.channelActive(ctx);
    }

    @Override
    public void channelInactive(ChannelHandlerContext ctx) throws Exception {
        super.channelInactive(ctx);
    }

}
