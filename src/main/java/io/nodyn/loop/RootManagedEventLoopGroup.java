/*
 * Copyright 2014 Red Hat, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package io.nodyn.loop;

import io.netty.channel.EventLoopGroup;

import java.util.concurrent.CountDownLatch;
import java.util.concurrent.TimeUnit;

/**
 * @author Bob McWhirter
 */
public class RootManagedEventLoopGroup extends AbstractManagedEventLoopGroup {

    private CountDownLatch latch = new CountDownLatch(1);
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
            this.latch.countDown();
        }
    }

    public void await() throws InterruptedException {
        this.latch.await();
    }

}
