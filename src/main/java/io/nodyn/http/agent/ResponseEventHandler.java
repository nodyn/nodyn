package io.nodyn.http.agent;

import io.netty.channel.ChannelHandlerContext;
import io.netty.channel.ChannelInboundHandlerAdapter;
import io.netty.handler.codec.http.HttpResponse;
import io.nodyn.CallbackResult;
import io.nodyn.http.TrailerHandler;
import io.nodyn.http.client.ClientIncomingMessageWrap;
import io.nodyn.http.client.ClientRequestWrap;

/**
 * @author Bob McWhirter
 */
public class ResponseEventHandler extends ChannelInboundHandlerAdapter {

    private final ClientRequestWrap request;

    public ResponseEventHandler(ClientRequestWrap request) {
        this.request = request;
    }

    @Override
    public void channelRead(ChannelHandlerContext ctx, Object msg) throws Exception {
        if (msg instanceof HttpResponse) {
            ctx.channel().config().setAutoRead(false);
            ClientIncomingMessageWrap incoming = new ClientIncomingMessageWrap(this.request.getSocket(), (HttpResponse) msg);
            ctx.pipeline().addBefore(ctx.name(), "trailers", new TrailerHandler(incoming));
            ctx.pipeline().addBefore(ctx.name(), "incoming.data", incoming.handler());
            this.request.emit("response", CallbackResult.createSuccess(incoming));
        }
        super.channelRead(ctx, msg);
    }

}
