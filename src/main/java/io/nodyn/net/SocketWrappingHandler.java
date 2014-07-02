package io.nodyn.net;

import io.netty.channel.ChannelHandlerContext;
import io.netty.channel.ChannelInboundHandlerAdapter;
import io.netty.util.AttributeKey;

/**
 * @author Bob McWhirter
 */
public class SocketWrappingHandler extends ChannelInboundHandlerAdapter {

    public static final AttributeKey<SocketWrap> SOCKET = AttributeKey.valueOf("socket");

    public SocketWrappingHandler() {
    }

    @Override
    public void channelActive(ChannelHandlerContext ctx) throws Exception {
        SocketWrap socket = new SocketWrap(ctx.newSucceededFuture());
        ctx.channel().attr(SOCKET).set(socket);
        ctx.pipeline().addBefore(ctx.name(), "socket.data", socket.handler());
        ctx.pipeline().fireUserEventTriggered(socket);
        super.channelActive(ctx);
    }
}
