package io.nodyn.net;

import io.netty.bootstrap.ServerBootstrap;
import io.netty.channel.*;
import io.netty.channel.socket.nio.NioServerSocketChannel;
import io.nodyn.CallbackResult;
import io.nodyn.EventSource;
import io.nodyn.http.DebugHandler;
import io.nodyn.loop.ManagedEventLoopGroup;
import io.nodyn.loop.RefEvents;
import io.nodyn.loop.RefHandle;

import java.net.Inet4Address;
import java.net.InetSocketAddress;
import java.util.concurrent.atomic.AtomicInteger;

/**
 * @author Bob McWhirter
 */
public class NetServerWrap extends EventSource {


    private final ManagedEventLoopGroup managedLoop;
    private ChannelFuture channelFuture;

    private AtomicInteger connectionCounter = new AtomicInteger();

    protected boolean allowHalfOpen = false;

    public NetServerWrap(ManagedEventLoopGroup managedLoop) {
        this.managedLoop = managedLoop;
    }

    protected Channel channel() {
        try {
            return this.channelFuture.sync().channel();
        } catch (InterruptedException e) {
            emit("error", CallbackResult.EMPTY_SUCCESS);
            e.printStackTrace();
        }
        return null;
    }

    public void setAllowHalfOpen(boolean allow) {
        this.allowHalfOpen = allow;
    }

    public void ref() {
        channel().pipeline().fireUserEventTriggered(RefEvents.REF);
    }

    public void unref() {
        channel().pipeline().fireUserEventTriggered(RefEvents.UNREF);
    }

    private ChannelInitializer<Channel> initializer(final RefHandle handle) {
        return new ChannelInitializer<Channel>() {
            @Override
            protected void initChannel(Channel channel) throws Exception {
                initializeServerChannel(channel, handle);
            }
        };
    }

    protected void initializeServerChannel(Channel channel, RefHandle handle) {
        ChannelPipeline pipeline = channel.pipeline();
        //pipeline.addLast("debug", new DebugHandler("server"));
        pipeline.addLast(new ServerHandler(NetServerWrap.this));
        pipeline.addLast("ref.handler", handle.handler());
        pipeline.addLast("error", new ErrorHandler());
    }

    private ChannelInitializer<Channel> childInitializer() {
        return new ChannelInitializer<Channel>() {
            @Override
            protected void initChannel(Channel channel) throws Exception {
                initializeConnectionChannel(channel);
            }
        };
    }

    protected void initializeConnectionChannel(Channel channel) {
        initializeConnectionChannelHead(channel);
        initializeConnectionChannelTail(channel);
    }

    protected void initializeConnectionChannelHead(Channel channel) {
        ChannelPipeline pipeline = channel.pipeline();
        channel.config().setAutoRead(false);
        //pipeline.addLast( "connection-debug", new DebugHandler( "server-connection" ) );
    }

    protected void initializeConnectionChannelTail(Channel channel) {
        ChannelPipeline pipeline = channel.pipeline();
        pipeline.addLast("socket.wrap", new SocketWrappingHandler());
        pipeline.addLast("emit.connection", new ConnectionEventHandler(NetServerWrap.this));
        pipeline.addLast("half.open", new HalfOpenHandler(NetServerWrap.this.allowHalfOpen));
        pipeline.addLast("ref.handler", this.managedLoop.newHandle().handler());
        pipeline.addLast("error", new ErrorHandler());
        channel.read();
    }

    public void listen(int port, String hostname) {
        RefHandle handle = this.managedLoop.newHandle();
        EventLoopGroup eventLoopGroup = this.managedLoop.getEventLoopGroup();
        ServerBootstrap bootstrap = new ServerBootstrap();
        bootstrap.group(eventLoopGroup);
        bootstrap.channel(NioServerSocketChannel.class);
        bootstrap.handler(initializer(handle));
        bootstrap.childHandler(childInitializer());

        this.channelFuture = bootstrap.bind(hostname, port);
    }

    void incrConnection() {
        this.connectionCounter.incrementAndGet();
    }

    void decrConnection() {
        this.connectionCounter.decrementAndGet();
        checkClose();
    }

    void checkClose() {
        if (this.connectionCounter.get() == 0) {
            emit("close", CallbackResult.EMPTY_SUCCESS);
        }
    }

    public String getLocalAddress() {
        return ((InetSocketAddress) channel().localAddress()).getAddress().getHostAddress().toString();
    }

    public int getLocalPort() {
        return ((InetSocketAddress) channel().localAddress()).getPort();
    }

    public String getLocalAddressFamily() {
        if (((InetSocketAddress) channel().localAddress()).getAddress() instanceof Inet4Address) {
            return "IPv4";
        }
        return "IPv6;";
    }

    public void close() {
        channel().close();
    }
}
