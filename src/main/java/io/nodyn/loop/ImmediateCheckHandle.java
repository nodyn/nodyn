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

import java.util.concurrent.Future;

/**
 * @author Bob McWhirter
 */
public class ImmediateCheckHandle implements Runnable {


    private final EventLoop loop;
    private final Runnable callback;
    private Future<?> future;

    public ImmediateCheckHandle(EventLoop loop, Runnable callback) {
        this.loop = loop;
        this.callback = callback;
    }

    public boolean isActive() {
        return this.future != null;
    }

    public void start() {
        if ( this.future != null ) {
            return;
        }
        this.future = this.loop.submitUserTask(this);
    }

    public void stop() {
        if ( this.future != null ) {
            this.future.cancel( true );
            this.future = null;
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
    }
}
