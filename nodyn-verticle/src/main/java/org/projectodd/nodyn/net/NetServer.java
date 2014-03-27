package org.projectodd.nodyn.net;

import io.netty.bootstrap.ServerBootstrap;
import io.netty.channel.Channel;
import io.netty.channel.ChannelInitializer;
import io.netty.channel.EventLoopGroup;
import io.netty.channel.socket.nio.NioServerSocketChannel;
import io.netty.channel.socket.nio.NioSocketChannel;
import org.projectodd.nodyn.Context;
import org.projectodd.nodyn.EventBroker;
import org.projectodd.nodyn.net.netty.ConnectionEventHandler;
import org.projectodd.nodyn.net.netty.ServerEventHandler;

import java.net.InetSocketAddress;
import java.net.SocketAddress;
import java.util.function.Consumer;

/**
 * @author Bob McWhirter
 */
public class NetServer extends EventBroker {

    public static class Event {
        public static final String LISTENING = "listening";
        public static final String CONNECTION = "connection";
        public static final String CLOSE = "close";
        public static final String ERROR = "error";
    }

    private final Context context;

    private int port;
    private String host;
    private Consumer<NioSocketChannel> channelInitializer;
    private Channel channel;

    public NetServer() {
        this( new Context() );
    }

    public NetServer(Context context) {
        this.context = context;
    }

    protected EventLoopGroup eventLoopGroup() {
        return this.context.eventLoopGroup();
    }

    public void port(int port) {
        this.port = port;
    }

    public int port() {
        return this.port;
    }

    public void host(String host) {
        this.host = host;
    }

    public String host() {
        return this.host;
    }

    protected SocketAddress localAddress() {
        return new InetSocketAddress(this.host, this.port);
    }

    public void initializer(Consumer<NioSocketChannel> initializer) {
        this.channelInitializer = initializer;
    }

    public Consumer<NioSocketChannel> initializer() {
        return this.channelInitializer;
    }

    public void listen() {
        ServerBootstrap serverBootstrap = new ServerBootstrap();
        serverBootstrap
                .channel(NioServerSocketChannel.class)
                .group(eventLoopGroup())
                .localAddress(localAddress())
                .handler( new ServerChannelInitializer() )
                .childHandler(new ConnectionChannelInitializer());
        this.channel = serverBootstrap.bind(localAddress()).channel();
    }

    public void close() {
        this.channel.close();
    }

    private class ServerChannelInitializer extends ChannelInitializer<NioServerSocketChannel> {
        @Override
        protected void initChannel(NioServerSocketChannel channel) throws Exception {
            channel.pipeline().addLast(new ServerEventHandler(NetServer.this));
        }
    }

    private class ConnectionChannelInitializer extends ChannelInitializer<NioSocketChannel> {
        @Override
        protected void initChannel(NioSocketChannel channel) throws Exception {
            channel.pipeline().addLast( new ConnectionEventHandler( NetServer.this ) );
            if (NetServer.this.channelInitializer != null) {
                NetServer.this.channelInitializer.accept(channel);
            }
        }
    }
}
