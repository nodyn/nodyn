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

package io.nodyn.buffer;

import io.netty.buffer.ByteBuf;
import org.dynjs.runtime.ExternalIndexedData;

/**
 * @author Bob McWhirter
 */
public class NettyExternalIndexedData implements ExternalIndexedData {

    private final ByteBuf buf;

    public NettyExternalIndexedData(ByteBuf buf) {
        this.buf = buf;
    }

    public ByteBuf buffer() {
        return this.buf;
    }

    @Override
    public Object get(long l) {
        return this.buf.getUnsignedByte((int) l);
    }

    @Override
    public void put(long l, Object o) {
        if (o instanceof Number) {
            int value = ((Number) o).intValue() & 0xFF;
            this.buf.setByte((int) l, value);
            this.buf.writerIndex((int) Math.max( this.buf.writerIndex(), l ));
        }
    }
}
