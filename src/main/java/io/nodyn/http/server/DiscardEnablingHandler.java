package io.nodyn.http.server;

import io.netty.channel.ChannelDuplexHandler;
import io.netty.channel.ChannelHandlerContext;
import io.netty.channel.ChannelPromise;
import io.netty.handler.codec.http.LastHttpContent;
import io.nodyn.http.DiscardHandler;


/**
 * @author Bob McWhirter
 */
public class DiscardEnablingHandler extends ChannelDuplexHandler {

    public DiscardEnablingHandler() {
    }

    @Override
    public void write(ChannelHandlerContext ctx, Object msg, ChannelPromise promise) throws Exception {
        if ( msg instanceof LastHttpContent ) {
            ctx.pipeline().addFirst( "discard", new DiscardHandler() );
        }
        super.write(ctx, msg, promise);
    }
}
