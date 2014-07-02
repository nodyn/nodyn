package io.nodyn.http.agent;

import io.netty.channel.ChannelDuplexHandler;
import io.netty.channel.ChannelHandlerContext;
import io.netty.channel.ChannelInboundHandlerAdapter;
import io.netty.channel.ChannelPromise;
import io.netty.handler.codec.http.HttpMethod;
import io.netty.handler.codec.http.HttpRequest;
import io.netty.handler.codec.http.HttpResponse;
import io.nodyn.CallbackResult;
import io.nodyn.http.client.ClientIncomingMessageWrap;
import io.nodyn.http.client.ClientRequestWrap;

/**
 * @author Bob McWhirter
 */
public class ConnectEventHandler extends ChannelDuplexHandler  {

    private final ClientRequestWrap request;
    private boolean connectInProgress;

    public ConnectEventHandler(ClientRequestWrap request) {
        this.request = request;
    }

    @Override
    public void channelRead(ChannelHandlerContext ctx, Object msg) throws Exception {
        if (this.connectInProgress && msg instanceof HttpResponse) {
            ClientIncomingMessageWrap incoming = new ClientIncomingMessageWrap(this.request.getSocket(), (HttpResponse) msg);
            ctx.pipeline().remove( "http.encoder" );
            ctx.pipeline().remove( "http.decoder" );
            ctx.pipeline().remove( "emit.response" );
            this.request.emit("connect", CallbackResult.createSuccess(incoming));
        }
        super.channelRead(ctx, msg);
    }

    @Override
    public void write(ChannelHandlerContext ctx, Object msg, ChannelPromise promise) throws Exception {
        if (msg instanceof HttpRequest) {
            if (((HttpRequest) msg).getMethod().equals(HttpMethod.CONNECT)) {
                this.connectInProgress = true;
            }
        }
        super.write(ctx, msg, promise);
    }
}
