package io.nodyn.timer;

import io.netty.channel.EventLoopGroup;
import io.netty.util.concurrent.ScheduledFuture;
import io.nodyn.handle.HandleWrap;
import io.nodyn.process.NodeProcess;

import java.util.concurrent.TimeUnit;

/**
 * @author Bob McWhirter
 */
public class TimerWrap extends HandleWrap implements Runnable {

    public static long now() {
        return System.currentTimeMillis();
    }

    private final EventLoopGroup eventLoop;
    private ScheduledFuture<?> future;

    public TimerWrap(NodeProcess process) {
        super( process );
        this.eventLoop = process.getEventLoop().getEventLoopGroup();
    }

    public void start(int msec, int repeat) {
        if ( msec == 0 ) {
            msec = 1;
        }
        this.future = this.eventLoop.schedule(this, msec, TimeUnit.MILLISECONDS);
    }

    public void stop() {
        this.future.cancel( false );
    }

    @Override
    public void run() {
        makeCallback(0);
    }
}
