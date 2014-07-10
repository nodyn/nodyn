package io.nodyn.stream;

import io.netty.buffer.ByteBuf;
import io.netty.channel.*;
import io.netty.handler.timeout.IdleStateEvent;
import io.netty.util.ReferenceCountUtil;
import io.nodyn.CallbackResult;
import io.nodyn.EventSource;

/**
 * @author Bob McWhirter
 */
public class StreamEventsHandler extends ChannelDuplexHandler {
    protected EventSource source;

    public StreamEventsHandler(EventSource source) {
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
                StreamEventsHandler.this.source.emit("close", CallbackResult.EMPTY_SUCCESS);
            }
        });
        super.close(ctx, future);
    }

    @Override
    public void channelInactive(ChannelHandlerContext ctx) throws Exception {
        this.source.emit("end", CallbackResult.EMPTY_SUCCESS );
        this.source.emit("close", CallbackResult.EMPTY_SUCCESS );
        super.channelInactive(ctx);
    }

    @Override
    public void userEventTriggered(ChannelHandlerContext ctx, Object evt) throws Exception {
        if (evt instanceof IdleStateEvent) {
            this.source.emit("timeout", CallbackResult.EMPTY_SUCCESS);
        }
        super.userEventTriggered(ctx, evt);
    }
}
