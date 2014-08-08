package io.nodyn.loop;

import io.netty.channel.EventLoopGroup;
import io.nodyn.process.NodeProcess;

import java.util.concurrent.TimeUnit;

/**
 * @author Bob McWhirter
 */
public class Ticker implements Runnable {

    private final ManagedEventLoopGroup managedLoop;
    private final Runnable tickCallback;
    private final TickInfo tickInfo;
    private final RefHandle handle;

    public Ticker(NodeProcess process, Runnable tickCallback, TickInfo tickInfo) {
        this.managedLoop = process.getEventLoop();
        this.handle = process.getEventLoop().newHandle();
        this.tickCallback = tickCallback;
        this.tickInfo = tickInfo;
    }

    @Override
    public void run() {
        this.tickCallback.run();
        if ( this.tickInfo.getLength() == 0 && this.managedLoop.refCount() == 1 ) {
            // just us
            this.handle.unref();
            return;
        }
        this.managedLoop.getEventLoopGroup().schedule(this, 500, TimeUnit.MILLISECONDS);
    }
}
