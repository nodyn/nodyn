package org.projectodd.nodyn.net;

import io.netty.bootstrap.Bootstrap;
import io.netty.channel.Channel;
import io.netty.channel.ChannelInitializer;
import io.netty.channel.EventLoopGroup;
import io.netty.channel.socket.nio.NioServerSocketChannel;
import io.netty.channel.socket.nio.NioSocketChannel;
import org.jboss.netty.bootstrap.ClientBootstrap;
import org.projectodd.nodyn.Context;
import org.projectodd.nodyn.EventBroker;
import org.projectodd.nodyn.net.netty.ConnectionEventHandler;
import org.projectodd.nodyn.net.netty.ServerEventHandler;

import java.net.InetSocketAddress;
import java.net.SocketAddress;

/**
 * @author Bob McWhirter
 */
public class NetClient extends EventBroker {



    private final Context context;

    private int port;
    private String host;
    private Channel channel;

    public NetClient() {
        this( new Context() );
    }

    public NetClient(Context context) {
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

    protected SocketAddress remoteAddress() {
        return new InetSocketAddress(this.host, this.port);
    }

    public void connect() {
        Bootstrap clientBootstrap = new Bootstrap();
        clientBootstrap
                .channel(NioSocketChannel.class)
                .group(eventLoopGroup())
                .remoteAddress(remoteAddress())
                .handler( new ClientChannelInitializer() );
        this.channel = clientBootstrap.connect(remoteAddress()).channel();
    }

    public void close() {
        this.channel.close();
    }

    private class ClientChannelInitializer extends ChannelInitializer<NioSocketChannel> {
        @Override
        protected void initChannel(NioSocketChannel channel) throws Exception {
            channel.pipeline().addLast( new ConnectionEventHandler( NetClient.this ) );
        }
    }
}
