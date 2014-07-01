package org.projectodd.nodyn.netty;

import io.netty.channel.EventLoopGroup;
import io.netty.channel.nio.NioEventLoopGroup;
import io.netty.util.concurrent.Future;
import io.netty.util.concurrent.FutureListener;

import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicInteger;

/**
 * @author Bob McWhirter
 */
public class ManagedEventLoopGroup implements RefCounted {

    private final int numThreads;
    private EventLoopGroup delegate;
    private int counter;

    public ManagedEventLoopGroup(int numThreads) {
        this.numThreads = numThreads;
        createEventLoopGroup();
    }

    public synchronized RefCountedEventLoopGroup getEventLoopGroup() {
        if ( this.delegate == null ) {
            createEventLoopGroup();
        }
        return new RefCountedEventLoopGroup(this);
    }

    EventLoopGroup getDelegate() {
        return this.delegate;
    }

    protected void createEventLoopGroup() {
        this.delegate = new NioEventLoopGroup( this.numThreads );
        this.counter = 0;
    }

    public synchronized void incrCount() {
        ++this.counter;
        //System.err.println( "++ now: " + this.counter );
    }

    public synchronized void decrCount() {
        --this.counter;
        //System.err.println( "-- now: " + this.counter );
        if (this.counter == 0 && this.delegate != null ) {
            this.delegate.shutdownGracefully(0, 2, TimeUnit.SECONDS);
            this.delegate = null;
        }
    }

}
