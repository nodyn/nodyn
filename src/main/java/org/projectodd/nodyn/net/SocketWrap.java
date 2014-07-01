package org.projectodd.nodyn.net;


import io.netty.bootstrap.Bootstrap;
import io.netty.buffer.ByteBuf;
import io.netty.channel.*;
import io.netty.channel.socket.nio.NioSocketChannel;
import io.netty.handler.timeout.ReadTimeoutHandler;
import io.netty.handler.timeout.WriteTimeoutHandler;
import org.projectodd.nodyn.EventSource;
import org.projectodd.nodyn.http.DebugHandler;
import org.projectodd.nodyn.netty.ManagedEventLoopGroup;
import org.projectodd.nodyn.netty.RefCountedEventLoopGroup;
import org.projectodd.nodyn.netty.RefEvents;

import java.net.SocketAddress;
import java.util.concurrent.TimeUnit;

/**
 * @author Bob McWhirter
 */
public class SocketWrap extends EventSource {

    private final ManagedEventLoopGroup managedLoop;
    private RefCountedEventLoopGroup eventLoopGroup;
    private ChannelFuture future;
    private boolean allowHalfOpen = false;

    public SocketWrap(ManagedEventLoopGroup managedLoop) {
        this.managedLoop = managedLoop;
    }

    public SocketWrap(ChannelFuture future) {
        this.future = future;
        this.managedLoop = null;
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
        return new SocketHandler(this);
    }

    public void write(ByteBuf chunk) {
        this.future.channel().writeAndFlush(chunk);
    }

    public void setTimeout(int timeoutMs) {
        ChannelPipeline pipeline = this.future.channel().pipeline();
        if (pipeline.get("read.timeout") != null) {
            pipeline.remove("read.timeout");
        }
        if (pipeline.get("write.timeout") != null) {
            pipeline.remove("write.timeout");
        }
        if (timeoutMs != 0) {
            pipeline.addFirst("read.timeout", new ReadTimeoutHandler(timeoutMs, TimeUnit.MILLISECONDS));
            pipeline.addFirst("write.timeout", new WriteTimeoutHandler(timeoutMs, TimeUnit.MILLISECONDS));
        }
    }

    public void connect(int port, String host) {
        this.eventLoopGroup = this.managedLoop.getEventLoopGroup();
        this.future = new Bootstrap()
                .remoteAddress(host, port)
                .channel(NioSocketChannel.class)
                .group(this.eventLoopGroup)
                .handler(new ChannelInitializer<Channel>() {
                    @Override
                    protected void initChannel(Channel ch) throws Exception {
                        //ch.pipeline().addLast(new DebugHandler("socket"));
                        ch.pipeline().addLast(SocketWrap.this.handler());
                        ch.pipeline().addLast("half.open", new HalfOpenHandler(SocketWrap.this.allowHalfOpen));
                        ch.pipeline().addLast("ref.handler", new RefHandleHandler(SocketWrap.this.eventLoopGroup.refHandle()));
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
        this.future.channel().disconnect();
    }

}
