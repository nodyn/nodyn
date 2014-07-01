package org.projectodd.nodyn.net;

import io.netty.channel.*;
import io.netty.util.AttributeKey;
import org.projectodd.nodyn.CallbackResult;
import org.projectodd.nodyn.EventSource;


/**
 * @author Bob McWhirter
 */
public class NetServerConnectionHandler extends ChannelDuplexHandler {

    protected static final AttributeKey<SocketWrap> SOCKET = AttributeKey.valueOf("socket");
    protected final NetServerWrap server;

    public NetServerConnectionHandler(NetServerWrap server) {
        this.server = server;
    }

    @Override
    public void channelActive(ChannelHandlerContext ctx) throws Exception {
        this.server.incrConnection();
        SocketWrap socket = new SocketWrap(ctx.newSucceededFuture());
        ctx.attr(SOCKET).set(socket);
        ctx.pipeline().addBefore(ctx.name(), "incoming.data", socket.handler());
        this.server.emit("connection", CallbackResult.createSuccess(socket));
        super.channelActive(ctx);
    }

    @Override
    public void channelInactive(ChannelHandlerContext ctx) throws Exception {
        this.server.decrConnection();
    }

    protected SocketWrap socket(ChannelHandlerContext ctx) {
        return ctx.attr(SOCKET).get();
    }

    protected EventSource connectionEventSource(ChannelHandlerContext ctx) {
        return socket(ctx);
    }
}
