package io.nodyn.net;

import io.netty.channel.ChannelDuplexHandler;
import io.netty.channel.ChannelHandlerContext;

/**
 * @author Bob McWhirter
 */
public class HalfOpenHandler extends ChannelDuplexHandler {

    private boolean allowHalfOpen;

    public HalfOpenHandler(boolean allow) {
        this.allowHalfOpen = allow;
    }

    @Override
    public void channelInactive(ChannelHandlerContext ctx) throws Exception {
        if (!this.allowHalfOpen) {
            if (ctx.channel().isOpen()) {
                ctx.close();
            }
        }
        super.channelInactive(ctx);
    }
}
