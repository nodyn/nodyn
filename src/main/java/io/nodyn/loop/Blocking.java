package io.nodyn.loop;

import io.netty.channel.EventLoopGroup;


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
        final EventLoopGroup elg = managedLoop.getEventLoopGroup();
        final RefHandle refHandle = managedLoop.newHandle();
        elg.submit(new Runnable() {
            @Override
            public void run() {
                try {
                    action.run();
                } finally {
                    refHandle.unref();
                }

            }
        });
    }


}
