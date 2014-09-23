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

package io.nodyn.async;

import io.nodyn.CallbackResult;
import io.nodyn.EventSource;
import io.nodyn.NodeProcess;

/**
 * @author Bob McWhirter
 */
public class AsyncWrap extends EventSource {

    protected final NodeProcess process;

    public AsyncWrap(NodeProcess process) {
        this.process = process;
    }

    public NodeProcess getProcess() {
        return this.process;
    }

    public void makeCallback(final int index) {
        this.process.getEventLoop().submitUserTask( new Runnable() {
            @Override
            public void run() {
                emit("makeCallbackByIndex", CallbackResult.createSuccess( index ) );
            }
        }, "make-callback-for-" + getClass().getSimpleName() );

    }

    public Object emit(final String event, final CallbackResult result) {
        this.process.getEventLoop().submitUserTask( new Runnable() {
            @Override
            public void run() {
                AsyncWrap.super.emit( event, result );
            }
        }, "emit-for-" + getClass().getSimpleName() );
        return null;
    }
}
