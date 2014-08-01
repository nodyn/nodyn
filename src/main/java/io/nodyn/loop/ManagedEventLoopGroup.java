package io.nodyn.loop;

import io.netty.channel.EventLoopGroup;

/**
 * @author Bob McWhirter
 */
public interface ManagedEventLoopGroup {

    RefHandle newHandle();
    RefHandle newHandle(boolean count);

    EventLoopGroup getEventLoopGroup();

    ChildManagedEventLoopGroup newChild();

    int refCount();

    void shutdown();
}
