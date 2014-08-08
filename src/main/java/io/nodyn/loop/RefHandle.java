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

/**
 * @author Bob McWhirter
 */
public class RefHandle {

    private final RefCounted refCounted;
    private boolean counted;

    public RefHandle(RefCounted refCounted) {
        this( refCounted, true );
    }

    public RefHandle(RefCounted refCounted, boolean count) {
        this.refCounted = refCounted;
        if ( count ) {
            ref();
        }
    }

    public RefHandle create() {
        return new RefHandle( this.refCounted );
    }

    public RefHandleHandler handler() {
        return new RefHandleHandler( this );
    }

    public synchronized void ref() {
        if ( this.counted ) {
            return;
        }

        this.counted = true;

        this.refCounted.incrCount();
    }

    public synchronized void unref() {
        if ( ! this.counted ) {
            return;
        }

        this.counted = false;

        this.refCounted.decrCount();
    }


}
