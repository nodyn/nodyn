package io.nodyn.net;

import io.netty.bootstrap.ServerBootstrap;
import io.netty.channel.Channel;
import io.netty.channel.ChannelFuture;
import io.netty.channel.ChannelInitializer;
import io.netty.channel.socket.nio.NioServerSocketChannel;
import io.nodyn.CallbackResult;
import io.nodyn.EventSource;
import io.nodyn.netty.ManagedEventLoopGroup;
import io.nodyn.netty.RefCountedEventLoopGroup;
import io.nodyn.netty.RefEvents;

import java.net.Inet4Address;
import java.net.InetSocketAddress;
import java.util.concurrent.atomic.AtomicInteger;

/**
 * @author Bob McWhirter
 */
public class NetServerWrap extends EventSource {


    private final ManagedEventLoopGroup managedLoop;
    private RefCountedEventLoopGroup eventLoopGroup;
    private ChannelFuture channelFuture;

    private AtomicInteger connectionCounter = new AtomicInteger();

    private boolean allowHalfOpen = false;

    public NetServerWrap(ManagedEventLoopGroup managedLoop) {
        this.managedLoop = managedLoop;
    }

    public void setAllowHalfOpen(boolean allow) {
        this.allowHalfOpen = allow;
    }

    public void ref() {
        this.channelFuture.channel().pipeline().fireUserEventTriggered(RefEvents.REF);
    }

    public void unref() {
        this.channelFuture.channel().pipeline().fireUserEventTriggered(RefEvents.UNREF);
    }

    protected ChannelInitializer<Channel> initializer() {
        return new ChannelInitializer<Channel>() {
            @Override
            protected void initChannel(Channel ch) throws Exception {
                //ch.pipeline().addLast("debug", new DebugHandler("server"));
                ch.pipeline().addLast(new NetServerHandler(NetServerWrap.this));
                ch.pipeline().addLast("ref.handler", new RefHandleHandler(NetServerWrap.this.eventLoopGroup.refHandle()));
            }
        };
    }

    protected ChannelInitializer<Channel> childInitializer() {
        return new ChannelInitializer<Channel>() {
            @Override
            protected void initChannel(Channel ch) throws Exception {
                ch.config().setAutoRead(false);
                //ch.pipeline().addLast("debug", new DebugHandler("server-connection"));
                ch.pipeline().addLast(new NetServerConnectionHandler(NetServerWrap.this));
                ch.pipeline().addLast("ref.handler", new RefHandleHandler(NetServerWrap.this.eventLoopGroup.refHandle()));
                ch.pipeline().addLast("half.open", new HalfOpenHandler( NetServerWrap.this.allowHalfOpen ));
                ch.read();
            }
        };
    }

    public void listen(int port, String hostname) {
        this.eventLoopGroup = this.managedLoop.getEventLoopGroup();
        ServerBootstrap bootstrap = new ServerBootstrap();
        bootstrap.group(this.eventLoopGroup);
        bootstrap.channel(NioServerSocketChannel.class);
        bootstrap.handler(initializer());
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
        return ((InetSocketAddress) this.channelFuture.channel().localAddress()).getAddress().getHostAddress().toString();
    }

    public int getLocalPort() {
        return ((InetSocketAddress) this.channelFuture.channel().localAddress()).getPort();
    }

    public String getLocalAddressFamily() {
        if (((InetSocketAddress) this.channelFuture.channel().localAddress()).getAddress() instanceof Inet4Address) {
            return "IPv4";
        }
        return "IPv6;";
    }

    public void close() {
        this.channelFuture.channel().close();
    }
}
