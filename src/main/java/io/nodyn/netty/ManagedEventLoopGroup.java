package io.nodyn.netty;

import io.netty.channel.EventLoopGroup;
import io.netty.channel.nio.NioEventLoop;
import io.netty.channel.nio.NioEventLoopGroup;

import java.util.concurrent.CountDownLatch;
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

        final CountDownLatch latch = new CountDownLatch(1);

        this.delegate.submit(new Runnable() {
            @Override
            public void run() {
                latch.countDown();
            }
        });

        try {
            latch.await();
        } catch (InterruptedException e) {
            e.printStackTrace();
            this.delegate = null;
        }
    }

    public RefHandle newHandle() {
        return new RefHandle(this);
    }

    public synchronized RefCountedEventLoopGroup getEventLoopGroup() {
        if (this.delegate == null) {
            createEventLoopGroup();
        }
        return new RefCountedEventLoopGroup(this);
    }

    EventLoopGroup getDelegate() {
        return this.delegate;
    }

    protected void createEventLoopGroup() {
        this.delegate = new NioEventLoopGroup(1);
    }

    public synchronized void incrCount() {
        ++this.counter;
        //System.err.println( "++ loop: " + this.counter );
    }

    public synchronized void decrCount() {
        --this.counter;
        //System.err.println( "-- loop: " + this.counter );
        if (this.counter == 0 && this.delegate != null) {
            this.delegate.shutdownGracefully(0, 2, TimeUnit.SECONDS);
            this.delegate = null;
        }
    }

}
