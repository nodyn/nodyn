package io.nodyn.http.agent;

import io.netty.channel.ChannelHandlerContext;
import io.netty.channel.ChannelInboundHandlerAdapter;
import io.netty.handler.codec.http.HttpResponse;
import io.netty.handler.codec.http.HttpResponseStatus;
import io.nodyn.CallbackResult;
import io.nodyn.http.client.ClientIncomingMessageWrap;
import io.nodyn.http.client.ClientRequestWrap;

/**
 * @author Bob McWhirter
 */
public class UpgradeEventHandler extends ChannelInboundHandlerAdapter {

    private final ClientRequestWrap request;

    public UpgradeEventHandler(ClientRequestWrap request) {
        this.request = request;
    }

    @Override
    public void channelRead(ChannelHandlerContext ctx, Object msg) throws Exception {
        if (msg instanceof HttpResponse) {
            if (((HttpResponse) msg).getStatus().equals(HttpResponseStatus.SWITCHING_PROTOCOLS)) {
                ClientIncomingMessageWrap incoming = new ClientIncomingMessageWrap(this.request.getSocket(), (HttpResponse) msg);
                ctx.pipeline().remove("http.encoder");
                ctx.pipeline().remove("http.decoder");
                ctx.pipeline().remove("emit.response");
                this.request.emit("upgrade", CallbackResult.createSuccess(incoming));
            }
        }
        super.channelRead(ctx, msg);
    }

}
