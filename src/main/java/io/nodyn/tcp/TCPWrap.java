package io.nodyn.tcp;

import io.netty.bootstrap.ServerBootstrap;
import io.netty.buffer.ByteBuf;
import io.netty.channel.Channel;
import io.netty.channel.ChannelFuture;
import io.netty.channel.ChannelInitializer;
import io.netty.channel.socket.nio.NioServerSocketChannel;
import io.nodyn.process.NodeProcess;
import io.nodyn.stream.InputStreamWrap;
import io.nodyn.stream.OutputStreamWrap;
import io.nodyn.stream.StreamWrap;

import java.io.IOException;

/**
 * @author Bob McWhirter
 */
public class TCPWrap extends StreamWrap {

    private String addr;
    private int port;

    public TCPWrap(NodeProcess process) {
        super(process);
    }

    public TCPWrap(NodeProcess process, ChannelFuture channelFuture) {
        super( process, channelFuture );
    }

    public void bind(String addr, int port) {
        this.addr = addr;
        this.port = port;
    }

    public void listen(int backlog) {
        ServerBootstrap bootstrap = new ServerBootstrap();
        bootstrap.group(getEventLoopGroup());
        bootstrap.channel(NioServerSocketChannel.class);
        bootstrap.childHandler(new ChannelInitializer<Channel>() {
            @Override
            protected void initChannel(Channel ch) throws Exception {
                ch.config().setAutoRead(false);
                ch.pipeline().addLast( "emit.connection", new ConnectionEventHandler( TCPWrap.this.process, TCPWrap.this ) );
            }
        });
        this.channelFuture = bootstrap.bind(this.addr, this.port);
        ref();
    }

}
