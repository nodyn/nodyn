package io.nodyn.loop;

import io.netty.channel.EventLoopGroup;

/**
 * @author Bob McWhirter
 */
public interface ManagedEventLoopGroup {

    RefHandle newHandle();

    EventLoopGroup getEventLoopGroup();

    ChildManagedEventLoopGroup newChild();

    void shutdown();
}
