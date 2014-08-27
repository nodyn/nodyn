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

import io.nodyn.NodeProcess;

import java.util.concurrent.TimeUnit;

/**
 * @author Bob McWhirter
 */
public class Ticker implements Runnable {

    private final EventLoop eventLoop;
    private final Runnable tickCallback;
    private final TickInfo tickInfo;
    private final RefHandle handle;

    public Ticker(NodeProcess process, Runnable tickCallback, TickInfo tickInfo) {
        this.eventLoop = process.getEventLoop();
        this.handle = process.getEventLoop().newHandle();
        this.tickCallback = tickCallback;
        this.tickInfo = tickInfo;
    }

    @Override
    public void run() {
        this.eventLoop.submitUserTask(new Runnable() {
            @Override
            public void run() {
                Ticker.this.tickCallback.run();
                if ( Ticker.this.tickInfo.getLength() == 0 && Ticker.this.eventLoop.refCount() == 1 ) {
                    // just us
                    Ticker.this.handle.unref();
                    return;
                }
                Ticker.this.eventLoop.scheduleUserTask( this, 500, TimeUnit.MILLISECONDS );
            }
        } );
    }
}
