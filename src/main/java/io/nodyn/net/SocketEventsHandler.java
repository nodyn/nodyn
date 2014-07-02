package io.nodyn.net;

import io.netty.buffer.ByteBuf;
import io.netty.channel.*;
import io.netty.handler.timeout.IdleStateEvent;
import io.netty.util.ReferenceCountUtil;
import io.nodyn.CallbackResult;
import io.nodyn.EventSource;

/**
 * @author Bob McWhirter
 */
public class SocketEventsHandler extends ChannelDuplexHandler {
    protected EventSource source;

    public SocketEventsHandler(EventSource source) {
        this.source = source;
    }

    @Override
    public void channelRead(ChannelHandlerContext ctx, Object msg) throws Exception {
        if (msg instanceof ByteBuf) {
            ReferenceCountUtil.retain(msg);
            this.source.emit("data", CallbackResult.createSuccess(msg));
        }
        super.channelRead(ctx, msg);
    }

    @Override
    public void close(ChannelHandlerContext ctx, ChannelPromise future) throws Exception {
        future.addListener(new ChannelFutureListener() {
            @Override
            public void operationComplete(ChannelFuture future) throws Exception {
                SocketEventsHandler.this.source.emit("close", CallbackResult.EMPTY_SUCCESS);
            }
        });
        super.close(ctx, future);
    }

    @Override
    public void channelActive(ChannelHandlerContext ctx) throws Exception {
        this.source.emit("connect", CallbackResult.EMPTY_SUCCESS);
        super.channelActive(ctx);
    }

    @Override
    public void userEventTriggered(ChannelHandlerContext ctx, Object evt) throws Exception {
        if (evt instanceof IdleStateEvent) {
            this.source.emit("timeout", CallbackResult.EMPTY_SUCCESS);
        }
        super.userEventTriggered(ctx, evt);
    }
}
