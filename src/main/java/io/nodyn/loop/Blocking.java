package io.nodyn.loop;

import io.nodyn.Callback;
import io.nodyn.netty.ManagedEventLoopGroup;
import io.nodyn.netty.RefCountedEventLoopGroup;
import io.nodyn.netty.RefHandle;


/**
 * @author Bob McWhirter
 */
public class Blocking {

    private final ManagedEventLoopGroup managedLoop;

    public Blocking(ManagedEventLoopGroup managedLoop) {
        this.managedLoop = managedLoop;
    }


    public void submit(final Runnable action) {
        final RefHandle handle = this.managedLoop.newHandle();
        new Thread(new Runnable() {
            @Override
            public void run() {
                action.run();
                handle.unref();
            }
        }).start();
    }

    public void unblock(final Runnable action) {
        final RefCountedEventLoopGroup elg = managedLoop.getEventLoopGroup();
        elg.submit(new Runnable() {
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
