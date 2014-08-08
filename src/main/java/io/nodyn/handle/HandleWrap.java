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

package io.nodyn.handle;

import io.nodyn.CallbackResult;
import io.nodyn.async.AsyncWrap;
import io.nodyn.loop.RefHandle;
import io.nodyn.NodeProcess;

/**
 * @author Bob McWhirter
 */
public class HandleWrap extends AsyncWrap {

    private final RefHandle handle;

    public HandleWrap(NodeProcess process, boolean count) {
        super( process );
        this.handle = process.getEventLoop().newHandle(count);
    }

    public void close() {
        this.handle.unref();
        emit( "close", CallbackResult.EMPTY_SUCCESS );
    }

    public void ref() {
        this.handle.ref();
    }

    public void unref() {
        this.handle.unref();
    }
}
