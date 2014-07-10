package io.nodyn.loop;

import io.nodyn.Callback;
import io.nodyn.netty.ManagedEventLoopGroup;
import io.nodyn.netty.RefCountedEventLoopGroup;


/**
 * @author Bob McWhirter
 */
public class Blocking {

    private final ManagedEventLoopGroup managedLoop;

    public Blocking(ManagedEventLoopGroup managedLoop) {
        this.managedLoop = managedLoop;
    }


    public void submit(Runnable action) {
        new Thread( action ).start();
    }

    public void unblock(final Runnable action) {
        final RefCountedEventLoopGroup elg = managedLoop.getEventLoopGroup();
        elg.submit( new Runnable() {
            @Override
            public void run() {
                try {
                    action.run();
                } finally {
                    elg.refHandle().unref();
                }

            }
        });
    }



}
