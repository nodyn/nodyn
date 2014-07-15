package io.nodyn.http.agent;

import io.netty.bootstrap.Bootstrap;
import io.netty.channel.Channel;
import io.netty.channel.ChannelFuture;
import io.netty.channel.ChannelInitializer;
import io.netty.channel.EventLoopGroup;
import io.netty.channel.socket.nio.NioSocketChannel;
import io.netty.handler.codec.http.HttpRequestEncoder;
import io.netty.handler.codec.http.HttpResponseDecoder;
import io.nodyn.http.HttpUnwrapper;
import io.nodyn.http.client.ClientRequestWrap;
import io.nodyn.loop.ManagedEventLoopGroup;
import io.nodyn.loop.RefHandleHandler;
import io.nodyn.net.ErrorHandler;
import io.nodyn.net.HalfOpenHandler;
import io.nodyn.net.SocketWrappingHandler;

/**
 * @author Bob McWhirter
 */
public class AgentWrap {

    private final ManagedEventLoopGroup managedLoop;
    private int maxSockets = 5;

    public AgentWrap(ManagedEventLoopGroup managedLoop) {
        this.managedLoop = managedLoop;
    }

    public void setMaxSockets(int maxSockets) {
        this.maxSockets = maxSockets;
    }

    public int getMaxSockets() {
        return this.maxSockets;
    }

    public ChannelFuture enqueue(final ClientRequestWrap request) {
        final EventLoopGroup eventLoopGroup = managedLoop.getEventLoopGroup();

        Bootstrap bootstrap = new Bootstrap();
        bootstrap.group(eventLoopGroup);
        bootstrap.channel(NioSocketChannel.class);
        bootstrap.handler(new ChannelInitializer<Channel>() {
            @Override
            protected void initChannel(Channel ch) throws Exception {
                //ch.pipeline().addLast("debug", new DebugHandler("http-client-raw"));
                ch.pipeline().addLast("emit.socket", new SocketEventHandler(request));
                ch.pipeline().addLast("http.encoder", new HttpRequestEncoder());
                ch.pipeline().addLast("http.decoder", new HttpResponseDecoder());
                ch.pipeline().addLast("emit.connect", new ConnectEventHandler(request));
                ch.pipeline().addLast("emit.upgrade", new UpgradeEventHandler(request));
                ch.pipeline().addLast("emit.continue", new ContinueEventHandler(request));
                ch.pipeline().addLast("emit.response", new ResponseEventHandler(request));
                ch.pipeline().addLast("http.unwrapper", new HttpUnwrapper());
                ch.pipeline().addLast("socket.wrap", new SocketWrappingHandler());
                ch.pipeline().addLast("half.open", new HalfOpenHandler(false));
                ch.pipeline().addLast("ref.handler", AgentWrap.this.managedLoop.newHandle().handler() );
                ch.pipeline().addLast("error", new ErrorHandler());
            }
        });

        ChannelFuture connectFuture = bootstrap.connect(request.getHost(), request.getPort());
        return connectFuture;
    }

}
