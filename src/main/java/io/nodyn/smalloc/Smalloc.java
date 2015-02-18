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

package io.nodyn.smalloc;

import io.nodyn.buffer.Buffer;
import java.nio.ByteBuffer;
import jdk.nashorn.api.scripting.ScriptObjectMirror;

/**
 * @author Bob McWhirter
 */
public class Smalloc {

    public static Object alloc(ScriptObjectMirror obj, int size) throws Exception {
        ByteBuffer buffer = ByteBuffer.allocate(size);
        Buffer.inject(obj, buffer);
        return obj;
    }

    public static Object truncate(ScriptObjectMirror obj, int len) {
        // we really have nothing to do?
        return obj;
    }

    public static Object sliceOnto(ScriptObjectMirror src, ScriptObjectMirror dest, int start, int end) {
        ByteBuffer srcBuf = Buffer.extract(src);
        int len = end - start;
        
        // Set the source buffer's position to the start of the new slice
        int origPosition = srcBuf.position();
        srcBuf.position(start);
        
        // Create a slice starting at the new position and set the limit to `len`
        // The new buffer's position is set by slice() to 0.
        ByteBuffer destBuf = srcBuf.slice();
        destBuf.limit(len);
        destBuf.position(0);
        
        // Reset the source buffer's position to it's original location
        srcBuf.position(origPosition);
        
        Buffer.inject(dest, destBuf);
        return src;
    }
}
