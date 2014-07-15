package io.nodyn.loop;

import io.netty.channel.EventLoopGroup;

/**
 * @author Bob McWhirter
 */
public class ChildManagedEventLoopGroup extends AbstractManagedEventLoopGroup {

    private AbstractManagedEventLoopGroup parent;

    ChildManagedEventLoopGroup(AbstractManagedEventLoopGroup parent) {
        this.parent = parent;
    }

    @Override
    public EventLoopGroup getEventLoopGroup() {
        return this.parent.getEventLoopGroup();
    }

    @Override
    public synchronized void incrCount() {
        this.parent.incrCount();
        super.incrCount();
    }

    @Override
    public synchronized void decrCount() {
        super.decrCount();
        this.parent.decrCount();
    }
}
