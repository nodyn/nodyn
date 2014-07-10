package io.nodyn.netty.pipe;

import io.netty.buffer.ByteBuf;
import io.netty.channel.ChannelConfig;
import io.netty.channel.ChannelMetadata;
import io.netty.channel.DefaultChannelConfig;
import io.netty.channel.FileRegion;
import io.netty.channel.nio.AbstractNioByteChannel;

import java.io.IOException;
import java.io.InputStream;
import java.net.SocketAddress;
import java.nio.ByteBuffer;
import java.nio.channels.Pipe;

/**
 * @author Bob McWhirter
 */
public abstract class AbstractNioStreamChannel extends AbstractNioByteChannel {

    protected final Pipe pipe;
    protected final ChannelConfig config;
    protected final ChannelMetadata metadata;

    protected AbstractNioStreamChannel(Pipe pipe) {
        super(null, pipe.source());
        this.pipe = pipe;
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
