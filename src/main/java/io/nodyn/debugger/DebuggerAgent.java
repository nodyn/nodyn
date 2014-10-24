package io.nodyn.debugger;

import io.netty.bootstrap.ServerBootstrap;
import io.netty.channel.*;
import io.netty.channel.socket.nio.NioServerSocketChannel;
import io.nodyn.NodeProcess;
import io.nodyn.netty.DebugHandler;

/**
 * @author Bob McWhirter
 */
public class DebuggerAgent {

    private final ChannelFuture channelFuture;

    public DebuggerAgent(EventLoopGroup group, final int port) {
        ServerBootstrap bootstrap = new ServerBootstrap();
        bootstrap.group(group);
        bootstrap.channel(NioServerSocketChannel.class);
        bootstrap.childHandler(new ChannelInitializer<Channel>() {
            @Override
            protected void initChannel(Channel ch) throws Exception {
                ch.config().setAutoRead(true);
                ch.pipeline().addLast("debug", new DebugHandler("server"));
                ch.pipeline().addLast("event", new DebugEventHandler() );
            }
        });
        this.channelFuture = bootstrap.bind(port);
        this.channelFuture.addListener(new ChannelFutureListener() {
            @Override
            public void operationComplete(ChannelFuture future) throws Exception {
                System.err.println("Debugger listening on port " + port);
            }
        });
    }
}
