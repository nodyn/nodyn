package io.nodyn.http;

import io.netty.channel.ChannelHandlerContext;
import io.netty.channel.ChannelInboundHandlerAdapter;
import io.netty.handler.codec.http.LastHttpContent;

/**
 * @author Bob McWhirter
 */
public class TrailerHandler extends ChannelInboundHandlerAdapter {
    private final IncomingMessage incoming;

    public TrailerHandler(IncomingMessage incoming) {
        this.incoming = incoming;
    }

    @Override
    public void channelRead(ChannelHandlerContext ctx, Object msg) throws Exception {
        if ( msg instanceof LastHttpContent ) {
            this.incoming.setTrailers( ((LastHttpContent) msg).trailingHeaders() );
        }
        super.channelRead( ctx, msg );
    }
}
