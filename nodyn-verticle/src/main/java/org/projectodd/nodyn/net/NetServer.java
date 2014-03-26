package org.projectodd.nodyn.net;

import io.netty.bootstrap.ServerBootstrap;
import io.netty.channel.Channel;
import io.netty.channel.ChannelInitializer;
import io.netty.channel.EventLoopGroup;
import io.netty.channel.socket.nio.NioServerSocketChannel;
import io.netty.channel.socket.nio.NioSocketChannel;

import java.net.InetSocketAddress;
import java.net.SocketAddress;
import java.util.function.Consumer;

/**
 * @author Bob McWhirter
 */
public class NetServer extends ChannelInitializer<NioSocketChannel> {

    public static class Event {
        public static final String LISTENING = "listening";
        public static final String CONNECTION = "connection";
        public static final String CLOSE = "close";
        public static final String ERROR = "error";
    }

    private final EventLoopGroup eventLoopGroup;
    private int port;
    private String host;
    private Consumer<NioSocketChannel> channelInitializer;
    private Channel channel;

    public NetServer(EventLoopGroup eventLoopGroup) {
        this.eventLoopGroup = eventLoopGroup;
    }

    protected EventLoopGroup eventLoopGroup() {
        return this.eventLoopGroup;
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
                .childHandler(this);

        this.channel = serverBootstrap.bind(localAddress()).channel();
    }

    public void close() {
        this.channel.close();
    }

    @Override
    protected void initChannel(NioSocketChannel channel) throws Exception {
        if (this.channelInitializer != null) {
            this.channelInitializer.accept(channel);
        }
    }
}
