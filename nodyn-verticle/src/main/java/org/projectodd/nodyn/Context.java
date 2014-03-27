package org.projectodd.nodyn;

import io.netty.channel.EventLoopGroup;
import io.netty.channel.nio.NioEventLoopGroup;

/**
 * @author Bob McWhirter
 */
public class Context {

    private final EventLoopGroup eventLoopGroup;

    public Context() {
        this( new NioEventLoopGroup(1) );
    }

    public Context(EventLoopGroup eventLoopGroup) {
        this.eventLoopGroup = eventLoopGroup;
    }

    public EventLoopGroup eventLoopGroup() {
        return this.eventLoopGroup;
    }

    public void shutdown() {
        this.eventLoopGroup.shutdownGracefully();
    }
}
