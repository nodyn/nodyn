package org.projectodd.nodyn.net;

import io.netty.channel.ChannelHandlerContext;
import io.netty.channel.ChannelInboundHandlerAdapter;
import org.projectodd.nodyn.netty.RefEvents;
import org.projectodd.nodyn.netty.RefHandle;

/**
 * @author Bob McWhirter
 */
public class RefHandleHandler extends ChannelInboundHandlerAdapter {

    private final RefHandle handle;

    public RefHandleHandler(RefHandle handle) {
        this.handle = handle;
    }

    @Override
    public void channelRegistered(ChannelHandlerContext ctx) throws Exception {
        this.handle.ref();
        super.channelRegistered(ctx);
    }

    @Override
    public void channelUnregistered(ChannelHandlerContext ctx) throws Exception {
        this.handle.unref();
        super.channelUnregistered(ctx);
    }

    @Override
    public void userEventTriggered(ChannelHandlerContext ctx, Object evt) throws Exception {
        if ( evt == RefEvents.REF ) {
            this.handle.ref();
        } else if ( evt == RefEvents.UNREF ) {
            this.handle.unref();
        }
        super.userEventTriggered(ctx, evt);
    }
}
