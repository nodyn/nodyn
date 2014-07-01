package org.projectodd.nodyn.http;

import io.netty.channel.*;
import io.netty.handler.codec.http.HttpRequest;
import io.netty.handler.codec.http.LastHttpContent;
import io.netty.util.AttributeKey;
import org.projectodd.nodyn.CallbackResult;
import org.projectodd.nodyn.EventSource;
import org.projectodd.nodyn.net.NetServerConnectionHandler;
import org.projectodd.nodyn.net.NetServerWrap;
import org.projectodd.nodyn.net.SocketWrap;


/**
 * @author Bob McWhirter
 */
public class HttpServerEventDispatcher extends NetServerConnectionHandler {

    protected static final AttributeKey<ServerIncomingMessageWrap> INCOMING = AttributeKey.valueOf("incoming");

    public HttpServerEventDispatcher(NetServerWrap server) {
        super( server );
    }

    @Override
    public void channelActive(ChannelHandlerContext ctx) throws Exception {
        SocketWrap socket = new SocketWrap(ctx.newSucceededFuture());
        ctx.attr(SOCKET).set(socket);
        //this.serverEventSource.emit("connection", CallbackResult.createSuccess(socket));
        super.channelActive(ctx);
    }

    @Override
    public void channelRead(ChannelHandlerContext ctx, Object msg) throws Exception {
        if (msg instanceof HttpRequest) {
            SocketWrap socket = socket(ctx);
            ServerIncomingMessageWrap incoming = new ServerIncomingMessageWrap(socket, (HttpRequest) msg);
            ctx.pipeline().addBefore(ctx.name(), "trailers", new TrailerHandler( incoming ) );
            ctx.pipeline().addBefore(ctx.name(), "content", new ServerIncomingDataHandler());
            ctx.pipeline().addBefore(ctx.name(), "incoming.data", incoming.handler());
            this.server.emit("request", CallbackResult.createSuccess(incoming, new ServerResponseWrap(ctx.channel())));
        }

        super.channelRead(ctx, msg);
    }

    @Override
    public void close(ChannelHandlerContext ctx, ChannelPromise future) throws Exception {
        connectionEventSource(ctx).emit( "close", CallbackResult.EMPTY_SUCCESS );
        super.close(ctx, future);
    }

    @Override
    public void write(ChannelHandlerContext ctx, Object msg, ChannelPromise promise) throws Exception {
        if (msg instanceof LastHttpContent) {
            connectionEventSource(ctx).emit("finish", CallbackResult.EMPTY_SUCCESS);
        }
        super.write(ctx, msg, promise);
    }

    @Override
    public void exceptionCaught(ChannelHandlerContext ctx, Throwable cause) throws Exception {
        cause.printStackTrace();
        super.exceptionCaught(ctx, cause);
    }

    protected ServerIncomingMessageWrap incoming(ChannelHandlerContext ctx) {
        return ctx.attr( INCOMING ).get();
    }

    @Override
    protected EventSource connectionEventSource(ChannelHandlerContext ctx) {
        return incoming(ctx);
    }
}
