package io.nodyn.http.server;

import io.netty.channel.ChannelHandlerContext;
import io.netty.handler.codec.http.HttpRequest;
import io.nodyn.CallbackResult;
import io.nodyn.http.TrailerHandler;
import io.nodyn.net.AbstractServerHandler;
import io.nodyn.net.NetServerWrap;
import io.nodyn.net.SocketWrap;


/**
 * @author Bob McWhirter
 */
public class RequestEventHandler extends AbstractServerHandler {

    public RequestEventHandler(NetServerWrap server) {
        super(server);
    }

    @Override
    public void channelRead(ChannelHandlerContext ctx, Object msg) throws Exception {
        if (msg instanceof HttpRequest) {
            ctx.channel().config().setAutoRead(false);
            SocketWrap socket = socket(ctx);
            ServerIncomingMessageWrap incoming = new ServerIncomingMessageWrap(socket, (HttpRequest) msg);

            ctx.pipeline().addBefore(ctx.name(), "trailers", new TrailerHandler(incoming));
            ctx.pipeline().addBefore(ctx.name(), "incoming.data", incoming.handler());
            ServerResponseWrap response = new ServerResponseWrap(ctx.channel());
            this.server.emit("request", CallbackResult.createSuccess(incoming, response));
            ctx.channel().read();
        }

        super.channelRead(ctx, msg);
    }

}
