package io.nodyn.http.agent;

import io.netty.channel.ChannelDuplexHandler;
import io.netty.channel.ChannelHandlerContext;
import io.netty.handler.codec.http.HttpResponse;
import io.netty.handler.codec.http.HttpResponseStatus;
import io.nodyn.CallbackResult;
import io.nodyn.http.client.ClientRequestWrap;

/**
 * @author Bob McWhirter
 */
public class ContinueEventHandler extends ChannelDuplexHandler {

    private final ClientRequestWrap request;

    public ContinueEventHandler(ClientRequestWrap request) {
        this.request = request;
    }

    @Override
    public void channelRead(ChannelHandlerContext ctx, Object msg) throws Exception {
        if (msg instanceof HttpResponse) {
            if (((HttpResponse) msg).getStatus().equals(HttpResponseStatus.CONTINUE)) {
                this.request.emit("continue", CallbackResult.EMPTY_SUCCESS );
                return;
            }
        }
        super.channelRead(ctx, msg);
    }

}
