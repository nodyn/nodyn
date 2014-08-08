package io.nodyn.loop;

import io.netty.channel.EventLoop;
import io.netty.channel.EventLoopGroup;
import io.netty.util.concurrent.Future;

/**
 * @author Bob McWhirter
 */
public class ImmediateCheckHandle implements Runnable {


    private final EventLoopGroup loop;
    private final RefHandle handle;
    private final Runnable callback;
    private Future<?> future;

    public ImmediateCheckHandle(ManagedEventLoopGroup loop, Runnable callback) {
        this.handle = loop.newHandle(false);
        this.loop = loop.getEventLoopGroup();
        this.callback = callback;
    }

    public boolean isActive() {
        return this.future != null;
    }

    public void start() {
        if ( this.future != null ) {
            return;
        }
        this.handle.ref();
        this.future = this.loop.submit(this);
    }

    public void stop() {
        if ( this.future != null ) {
            this.handle.unref();
            this.future.cancel( true );
        }
    }

    @Override
    public void run() {
        try {
            this.callback.run();
        } catch (Throwable t){
            t.printStackTrace();
        }
        this.future = null;
        this.handle.unref();
    }
}
