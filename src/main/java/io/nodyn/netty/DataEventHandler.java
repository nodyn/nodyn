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

package io.nodyn.netty;

import io.netty.buffer.ByteBuf;
import io.netty.channel.ChannelHandlerContext;
import io.netty.util.ReferenceCountUtil;
import io.nodyn.NodeProcess;
import io.nodyn.async.AsyncWrap;
import java.nio.ByteBuffer;


/**
 * @author Bob McWhirter
 */
public class DataEventHandler extends AbstractEventSourceHandler {

    public DataEventHandler(NodeProcess process, AsyncWrap eventSource) {
        super(process, eventSource);
    }


    @Override
    public void channelRead(ChannelHandlerContext ctx, Object msg) throws Exception {
        if (msg instanceof ByteBuf) {
            final ByteBuf content = (ByteBuf)msg;
            final byte[] arr = new byte[content.readableBytes()];
            content.readBytes(arr);
            final ByteBuffer buf = ByteBuffer.wrap(arr);
            buf.position(arr.length);
            emit("data", buf);
        } else {
            emit("data", ReferenceCountUtil.retain(msg));
        }
        super.channelRead(ctx, msg);
    }
}
