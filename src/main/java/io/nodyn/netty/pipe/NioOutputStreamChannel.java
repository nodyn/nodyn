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

package io.nodyn.netty.pipe;

import io.netty.buffer.ByteBuf;
import io.netty.channel.*;
import io.nodyn.NodeProcess;

import java.io.IOException;
import java.io.OutputStream;
import java.net.SocketAddress;
import java.nio.ByteBuffer;
import java.nio.channels.Pipe;

/**
 * @author Bob McWhirter
 */
public class NioOutputStreamChannel extends AbstractChannel {

    private final OutputStream out;
    private final NodeProcess process;
    private final DefaultChannelConfig config;
    private final ChannelMetadata metadata;
    private boolean open;

    public static NioOutputStreamChannel create(NodeProcess process, OutputStream out) throws IOException {
        NioOutputStreamChannel s = new NioOutputStreamChannel(process, out);
        return s;
    }

    protected NioOutputStreamChannel(NodeProcess process, OutputStream out) {
        super(null);
        this.process = process;
        this.out = out;
        this.config = new DefaultChannelConfig(this);
        this.metadata = new ChannelMetadata(false);
        this.open = true;
    }

    @Override
    protected AbstractUnsafe newUnsafe() {
        return new AbstractUnsafe() {
            @Override
            public void connect(SocketAddress remoteAddress, SocketAddress localAddress, ChannelPromise promise) {
                // no-op
            }
        };
    }

    @Override
    protected boolean isCompatible(EventLoop loop) {
        return true;
    }

    @Override
    protected SocketAddress localAddress0() {
        return null;
    }

    @Override
    protected SocketAddress remoteAddress0() {
        return null;
    }

    @Override
    protected void doBind(SocketAddress localAddress) throws Exception {
        // no-op
    }

    @Override
    protected void doDisconnect() throws Exception {
        this.open = false;
    }

    @Override
    protected void doClose() throws Exception {
        this.open = false;
    }

    @Override
    protected void doBeginRead() throws Exception {
        // no-op;

    }

    @Override
    protected void doWrite(final ChannelOutboundBuffer in) throws Exception {
        this.process.getEventLoop().submitBlockingTask(new Runnable() {
            public void run() {
                ByteBuffer[] buffers = in.nioBuffers();
                for (int i = 0; i < buffers.length; ++i) {
                    ByteBuffer each = buffers[i];
                    int amount = each.limit() - each.position();
                    byte[] bytes = new byte[amount];
                    each.get(bytes);
                    try {
                        NioOutputStreamChannel.this.out.write(bytes);
                    } catch (IOException e) {
                        NioOutputStreamChannel.this.process.getNodyn().handleThrowable(e);
                    }
                }
            }
        });
    }

    @Override
    public ChannelConfig config() {
        return this.config;
    }

    @Override
    public boolean isOpen() {
        return this.open;
    }

    public boolean isActive() {
        return this.open;
    }

    @Override
    public ChannelMetadata metadata() {
        return this.metadata;
    }

}
