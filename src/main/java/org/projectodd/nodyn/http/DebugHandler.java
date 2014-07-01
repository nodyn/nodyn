package org.projectodd.nodyn.http;

import io.netty.channel.ChannelDuplexHandler;
import io.netty.channel.ChannelHandlerContext;
import io.netty.channel.ChannelPromise;

import java.net.SocketAddress;

/**
 * @author Bob McWhirter
 */
public class DebugHandler extends ChannelDuplexHandler {

    private final String name;

    public DebugHandler(String name) {
        this.name = name;
    }

    @Override
    public void channelRead(ChannelHandlerContext ctx, Object msg) throws Exception {
        System.err.println( ctx.channel() + " | " + this.name + " >> IN >> " + msg );
        super.channelRead(ctx, msg);
    }

    @Override
    public void write(ChannelHandlerContext ctx, Object msg, ChannelPromise promise) throws Exception {
        System.err.println( ctx.channel() + " | " + this.name + " << OUT << " + msg );
        super.write(ctx, msg, promise);
    }

    @Override
    public void bind(ChannelHandlerContext ctx, SocketAddress localAddress, ChannelPromise future) throws Exception {
        System.err.println( ctx.channel() + " | " + this.name + " << BIND" );
        super.bind(ctx, localAddress, future);
    }

    @Override
    public void close(ChannelHandlerContext ctx, ChannelPromise future) throws Exception {
        System.err.println( ctx.channel() + " | " + this.name + " << CLOSE" );
        super.close(ctx, future);
    }

    @Override
    public void disconnect(ChannelHandlerContext ctx, ChannelPromise future) throws Exception {
        System.err.println( ctx.channel() + " | " + this.name + " << DISCONNECT" );
        super.disconnect(ctx, future);
    }

    @Override
    public void channelInactive(ChannelHandlerContext ctx) throws Exception {
        System.err.println( ctx.channel() + " | " + this.name + " >> CHANNEL INACTIVE" );
        super.channelInactive(ctx);
    }
}
