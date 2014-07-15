package io.nodyn.loop;

import java.util.HashSet;
import java.util.Set;

/**
 * @author Bob McWhirter
 */
public abstract class AbstractManagedEventLoopGroup implements ManagedEventLoopGroup, RefCounted {

    protected int counter;
    private Set<ChildManagedEventLoopGroup> children = new HashSet<>();

    public AbstractManagedEventLoopGroup() {
        this.counter = 0;
    }

    public ChildManagedEventLoopGroup newChild() {
        ChildManagedEventLoopGroup child = new ChildManagedEventLoopGroup(this);
        this.children.add( child );
        return child;
    }

    public RefHandle newHandle() {
        return new RefHandle(this);
    }

    public synchronized void incrCount() {
        ++this.counter;
        //System.err.println( getClass().getSimpleName() + " ++ " + this.counter );
    }

    public synchronized void decrCount() {
        --this.counter;
        //System.err.println( getClass().getSimpleName() + " -- " + this.counter );
        if (this.counter == 0 ) {
            doShutdown();
        }
    }

    protected void doShutdown() {
        //System.err.println( getClass().getSimpleName() + " XX doShutdown()" );
        for ( ChildManagedEventLoopGroup each : this.children ) {
            each.doShutdown();
        }

        this.children.clear();
    }

}
