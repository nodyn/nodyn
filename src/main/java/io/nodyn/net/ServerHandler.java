package io.nodyn.net;

import io.netty.channel.*;
import io.nodyn.CallbackResult;

import java.net.SocketAddress;


/**
 * @author Bob McWhirter
 */
public class ServerHandler extends ChannelDuplexHandler {

    protected final NetServerWrap server;

    public ServerHandler(NetServerWrap server) {
        this.server = server;
    }

    @Override
    public void bind(ChannelHandlerContext ctx, SocketAddress localAddress, ChannelPromise future) throws Exception {
        future.addListener( new ChannelFutureListener() {
            @Override
            public void operationComplete(ChannelFuture future) throws Exception {
                ServerHandler.this.server.emit( "listening", CallbackResult.EMPTY_SUCCESS );
            }
        });
        super.bind( ctx, localAddress, future );
    }

    @Override
    public void close(ChannelHandlerContext ctx, ChannelPromise future) throws Exception {
        future.addListener( new ChannelFutureListener() {
            @Override
            public void operationComplete(ChannelFuture future) throws Exception {
                ServerHandler.this.server.checkClose();
            }
        });
        super.close(ctx, future);
    }

}
