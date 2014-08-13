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

import io.netty.channel.ChannelConfig;
import io.netty.channel.ChannelMetadata;
import io.netty.channel.DefaultChannelConfig;
import io.netty.channel.nio.AbstractNioByteChannel;

import java.net.SocketAddress;
import java.nio.channels.Pipe;

/**
 * @author Bob McWhirter
 */
public abstract class AbstractNioStreamChannel extends AbstractNioByteChannel {

    protected final ChannelConfig config;
    protected final ChannelMetadata metadata;

    protected AbstractNioStreamChannel(Pipe pipe) {
        super(null, pipe.source());
        this.config = new DefaultChannelConfig(this);
        this.metadata = new ChannelMetadata(false);
    }

    @Override
    public ChannelConfig config() {
        return this.config;
    }

    @Override
    public ChannelMetadata metadata() {
        return this.metadata;
    }

    @Override
    protected boolean doConnect(SocketAddress remoteAddress, SocketAddress localAddress) throws Exception {
        return true;
    }

    @Override
    protected void doFinishConnect() throws Exception {
        // empty
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
        // empty
    }

    @Override
    protected void doDisconnect() throws Exception {
        // empty
    }

}
