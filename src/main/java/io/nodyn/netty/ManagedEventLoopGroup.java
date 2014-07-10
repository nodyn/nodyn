package io.nodyn.netty;

import io.netty.channel.EventLoopGroup;
import io.netty.channel.nio.NioEventLoop;
import io.netty.channel.nio.NioEventLoopGroup;

import java.util.concurrent.TimeUnit;

/**
 * @author Bob McWhirter
 */
public class ManagedEventLoopGroup implements RefCounted {

    private EventLoopGroup delegate;
    private int counter;

    public ManagedEventLoopGroup(EventLoopGroup group) {
        this.delegate = group;
        this.counter = 0;
        System.err.println("GROUP " + group);
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
        System.err.println("WARNING: WTF");
        this.delegate = new NioEventLoopGroup( 1 );
    }

    public synchronized void incrCount() {
        ++this.counter;
        //System.err.println( "++ incr now: " + this.counter );
    }

    public synchronized void decrCount() {
        --this.counter;
        //System.err.println( "-- decr now: " + this.counter );
        if (this.counter == 0 && this.delegate != null ) {
            this.delegate.shutdownGracefully(0, 2, TimeUnit.SECONDS);
            this.delegate = null;
        }
    }

}
