package io.nodyn.net;


import io.netty.bootstrap.Bootstrap;
import io.netty.buffer.ByteBuf;
import io.netty.channel.*;
import io.netty.channel.socket.nio.NioSocketChannel;
import io.netty.handler.timeout.IdleStateHandler;
import io.nodyn.EventSource;
import io.nodyn.loop.ManagedEventLoopGroup;
import io.nodyn.loop.RefEvents;

import java.net.SocketAddress;
import java.util.concurrent.TimeUnit;

/**
 * @author Bob McWhirter
 */
public class SocketWrap extends EventSource {

    private final ManagedEventLoopGroup managedLoop;
    private ChannelFuture future;
    private boolean allowHalfOpen = false;

    public SocketWrap(ManagedEventLoopGroup managedLoop) {
        this.managedLoop = managedLoop;
    }

    public SocketWrap(ChannelFuture future) {
        this.future = future;
        this.managedLoop = null;
    }

    public Channel channel() {
        try {
            return this.future.sync().channel();
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        return null;
    }

    public void setAllowHalfOpen(boolean allow) {
        this.allowHalfOpen = allow;
    }

    public void ref() {
        this.future.channel().pipeline().fireUserEventTriggered(RefEvents.REF);
    }

    public void unref() {
        this.future.channel().pipeline().fireUserEventTriggered(RefEvents.UNREF);
    }

    public void readStart() {
        this.future.channel().config().setAutoRead(true);
    }

    public void readStop() {
        this.future.channel().config().setAutoRead(false);
    }

    public ChannelInboundHandler handler() {
        return new SocketEventsHandler(this);
    }

    public void write(ByteBuf chunk) {
        channel().writeAndFlush(chunk);
    }

    public void setTimeout(int timeoutMs) {
        ChannelPipeline pipeline = this.future.channel().pipeline();
        if (pipeline.get("emit.timeout") != null) {
            pipeline.remove("emit.timeout");
        }
        if (timeoutMs != 0) {
            pipeline.addFirst("emit.timeout", new IdleStateHandler(0, 0, timeoutMs, TimeUnit.MILLISECONDS));
        }
    }

    public void connect(int port, String host) {
        EventLoopGroup eventLoopGroup = this.managedLoop.getEventLoopGroup();
        this.future = new Bootstrap()
                .remoteAddress(host, port)
                .channel(NioSocketChannel.class)
                .group(eventLoopGroup)
                .handler(new ChannelInitializer<Channel>() {
                    @Override
                    protected void initChannel(Channel ch) throws Exception {
                        ch.pipeline().addLast(SocketWrap.this.handler());
                        ch.pipeline().addLast("half.open", new HalfOpenHandler(SocketWrap.this.allowHalfOpen));
                        ch.pipeline().addLast("ref.handler", SocketWrap.this.managedLoop.newHandle().handler() );
                    }
                })
                .connect();
    }

    public void setKeepAlive(boolean enable) {
        this.future.channel().config().setOption(ChannelOption.SO_KEEPALIVE, enable);
    }

    public void setNoDelay(boolean enable) {
        this.future.channel().config().setOption(ChannelOption.TCP_NODELAY, enable);
    }

    public SocketAddress getRemoteAddress() {
        return this.future.channel().remoteAddress();
    }

    public void destroy() {
        this.future.channel().close();
        this.future.channel().disconnect();
    }

}
