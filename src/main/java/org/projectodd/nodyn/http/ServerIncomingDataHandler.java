package org.projectodd.nodyn.http;

import io.netty.channel.ChannelHandler;
import io.netty.channel.ChannelHandlerContext;
import io.netty.channel.ChannelInboundHandlerAdapter;
import io.netty.handler.codec.http.HttpContent;

/**
 * @author Bob McWhirter
 */
public class ServerIncomingDataHandler extends ChannelInboundHandlerAdapter {
    @Override
    public void channelRead(ChannelHandlerContext ctx, Object msg) throws Exception {
        if (msg instanceof HttpContent) {
            super.channelRead(ctx, ((HttpContent) msg).content() );
        } else {
            super.channelRead(ctx, msg);
        }
    }
}
