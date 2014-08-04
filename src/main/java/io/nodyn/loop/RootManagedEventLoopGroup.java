package io.nodyn.loop;

import io.netty.channel.EventLoop;
import io.netty.channel.EventLoopGroup;
import io.netty.channel.SingleThreadEventLoop;
import io.netty.channel.nio.NioEventLoopGroup;
import io.netty.util.concurrent.Future;
import io.netty.util.concurrent.FutureListener;

import java.io.Closeable;
import java.io.IOException;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.TimeUnit;

/**
 * @author Bob McWhirter
 */
public class RootManagedEventLoopGroup extends AbstractManagedEventLoopGroup {

    private EventLoopGroup eventLoopGroup;

    public RootManagedEventLoopGroup(EventLoopGroup eventLoopGroup) {
        this.eventLoopGroup = eventLoopGroup;

        final CountDownLatch latch = new CountDownLatch(1);

        this.eventLoopGroup.submit(new Runnable() {
            @Override
            public void run() {
                latch.countDown();
            }
        });

        try {
            latch.await();
        } catch (InterruptedException e) {
            e.printStackTrace();
            this.eventLoopGroup = null;
        }
    }

    public EventLoopGroup getEventLoopGroup() {
        return this.eventLoopGroup;
    }

    public void shutdown() {
        doShutdown();
    }

    protected void doShutdown() {
        super.doShutdown();
        if (this.eventLoopGroup != null) {
            //System.err.println( "*** SHUTDOWN" );
            this.eventLoopGroup.shutdownGracefully(0, 2, TimeUnit.SECONDS);
            this.eventLoopGroup = null;
        }
    }

}
