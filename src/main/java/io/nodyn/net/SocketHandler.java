package io.nodyn.net;

import io.netty.buffer.ByteBuf;
import io.netty.channel.*;
import io.netty.handler.timeout.TimeoutException;
import io.nodyn.CallbackResult;

/**
 * @author Bob McWhirter
 */
class SocketHandler extends ChannelDuplexHandler {
    private SocketWrap socket;

    public SocketHandler(SocketWrap socket) {
        this.socket = socket;
    }

    @Override
    public void channelRead(ChannelHandlerContext ctx, Object msg) throws Exception {
        if (msg instanceof ByteBuf) {
            this.socket.emit("data", CallbackResult.createSuccess(msg));
        }
        super.channelRead(ctx, msg);
    }

    @Override
    public void close(ChannelHandlerContext ctx, ChannelPromise future) throws Exception {
        future.addListener(new ChannelFutureListener() {
            @Override
            public void operationComplete(ChannelFuture future) throws Exception {
                SocketHandler.this.socket.emit("close", CallbackResult.EMPTY_SUCCESS);
            }
        });
        super.close(ctx, future);
    }

    @Override
    public void channelActive(ChannelHandlerContext ctx) throws Exception {
        this.socket.emit("connect", CallbackResult.EMPTY_SUCCESS);
        super.channelActive(ctx);
    }

    @Override
    public void exceptionCaught(ChannelHandlerContext ctx, Throwable cause) throws Exception {
        if (cause instanceof TimeoutException) {
            this.socket.emit("timeout", CallbackResult.EMPTY_SUCCESS);
        } else {
            super.exceptionCaught(ctx, cause);
        }
    }
}
