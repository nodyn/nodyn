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

package io.nodyn.stream;

import io.netty.buffer.ByteBuf;
import io.netty.channel.ChannelFuture;
import io.netty.channel.ChannelFutureListener;
import io.netty.channel.ChannelPipeline;
import io.nodyn.handle.HandleWrap;
import io.nodyn.NodeProcess;

import java.io.IOException;
import java.nio.ByteBuffer;
import java.nio.charset.StandardCharsets;

/**
 * @author Bob McWhirter
 */
public class StreamWrap extends HandleWrap {

    protected ChannelFuture channelFuture;

    public StreamWrap(NodeProcess process, boolean count) {
        super(process, count);
    }

    public StreamWrap(NodeProcess process, ChannelFuture channelFuture) {
        super(process, true);
        this.channelFuture = channelFuture;
    }

    public ChannelPipeline getPipeline() {
        return this.channelFuture.channel().pipeline();
    }

    public void readStart() {
        this.channelFuture.channel().config().setAutoRead(true);
        this.channelFuture.channel().read();
    }

    public void readStop() {
        this.channelFuture.channel().config().setAutoRead(false);
    }

    public void close() {
        if (this.channelFuture != null && this.channelFuture.channel() != null) {
            this.channelFuture.addListener(ChannelFutureListener.CLOSE);
        }
        super.close();
    }

    public void shutdown() throws InterruptedException {
    }

    public void write(ByteBuf buf) throws IOException {
        this.channelFuture.channel().writeAndFlush(buf.retain());
    }

    public void writeBinaryString(String str) throws IOException {
        ByteBuf buf = this.channelFuture.channel().alloc().buffer();
        buf.writeBytes(str.getBytes(StandardCharsets.ISO_8859_1));
        write(buf);
    }

    public void writeUtf8String(String str) throws IOException {
        ByteBuf buf = this.channelFuture.channel().alloc().buffer();
        buf.writeBytes(str.getBytes("utf8"));
        write(buf);
    }

    public void writeAsciiString(String str) throws IOException {
        ByteBuf buf = this.channelFuture.channel().alloc().buffer();
        buf.writeBytes(str.getBytes("us-ascii"));
        write(buf);
    }

}
