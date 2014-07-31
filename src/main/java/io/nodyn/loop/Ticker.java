package io.nodyn.loop;

import io.netty.channel.EventLoopGroup;

import java.util.concurrent.TimeUnit;

/**
 * @author Bob McWhirter
 */
public class Ticker implements Runnable {

    private final EventLoopGroup eventLoop;
    private final Runnable tickCallback;

    public Ticker(EventLoopGroup eventLoop, Runnable tickCallback) {
        this.eventLoop = eventLoop;
        this.tickCallback = tickCallback;
    }

    @Override
    public void run() {
        this.tickCallback.run();
        this.eventLoop.schedule( this, 500, TimeUnit.MILLISECONDS );
    }
}
