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

import io.netty.buffer.ByteBuf;
import io.netty.buffer.Unpooled;
import io.nodyn.buffer.NettyExternalIndexedData;
import org.dynjs.runtime.JSObject;

/**
 * @author Bob McWhirter
 */
public class Smalloc {

    public static Object alloc(JSObject obj, int size) throws Exception {
        if ( obj.hasExternalIndexedData() ) {
            throw new Exception( "already has external data" );
        }

        ByteBuf b = Unpooled.buffer(size);
        obj.setExternalIndexedData(new NettyExternalIndexedData(b));
        return obj;
    }

    public static Object truncate(JSObject obj, int len) {
        // we really have nothing to do?
        return obj;
    }

    public static Object sliceOnto(JSObject src, JSObject dest, int start, int end) {
        ByteBuf srcBuf = ((NettyExternalIndexedData)src.getExternalIndexedData()).buffer();
        int len = end - start;
        ByteBuf destBuf = srcBuf.slice( start, len );
        destBuf.writerIndex(0);
        dest.setExternalIndexedData(new NettyExternalIndexedData(destBuf));
        return src;
    }
}
