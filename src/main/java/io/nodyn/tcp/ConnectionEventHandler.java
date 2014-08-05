package io.nodyn.tcp;

import io.netty.channel.ChannelHandlerContext;
import io.nodyn.CallbackResult;
import io.nodyn.EventSource;
import io.nodyn.net.AbstractServerHandler;
import io.nodyn.net.NetServerWrap;
import io.nodyn.process.NodeProcess;


/**
 * @author Bob McWhirter
 */
public class ConnectionEventHandler extends AbstractEventSourceHandler {

    public ConnectionEventHandler(NodeProcess process, EventSource eventSource) {
        super(process, eventSource);
    }

    @Override
    public void channelActive(ChannelHandlerContext ctx) throws Exception {
        TCPWrap clientHandle = new TCPWrap(this.process, ctx.channel().newSucceededFuture());
        ctx.pipeline().addAfter(ctx.name(), "emit.close", new EOFEventHandler(this.process, clientHandle));
        ctx.pipeline().addAfter(ctx.name(), "emit.data", new DataEventHandler(this.process, clientHandle));
        emit("connection", clientHandle);
        super.channelActive(ctx);
    }

}
