package io.nodyn.pipe;

import io.netty.channel.ChannelFuture;
import io.nodyn.NodeProcess;
import io.nodyn.netty.DataEventHandler;
import io.nodyn.netty.EOFEventHandler;
import io.nodyn.netty.pipe.NioInputStreamChannel;
import io.nodyn.netty.pipe.NioOutputStreamChannel;
import io.nodyn.stream.StreamWrap;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;

/**
 * @author Bob McWhirter
 */
public class PipeWrap extends StreamWrap {

    private static enum Type {
        INPUT,
        OUTPUT,
    }

    private Type type;

    public PipeWrap(NodeProcess process) {
        super(process, true);
    }

    public PipeWrap(NodeProcess process, ChannelFuture channelFuture) {
        super(process, channelFuture);
    }

    public void setInput(InputStream in) throws IOException {
        NioInputStreamChannel channel = NioInputStreamChannel.create(in);
        channel.config().setAutoRead(false);
        channel.pipeline().addLast("emit.data", new DataEventHandler(this.process, this));
        channel.pipeline().addLast("emit.eof", new EOFEventHandler(this.process, this));
        this.channelFuture = channel.newSucceededFuture();
        process.getEventLoop().getEventLoopGroup().register(channel);
        this.type = Type.INPUT;
    }

    public void setOutput(OutputStream out) throws IOException {
        NioOutputStreamChannel channel = NioOutputStreamChannel.create(out);
        channel.config().setAutoRead(false);
        //channel.pipeline().addLast("emit.eof", new EOFEventHandler(this.process, this));
        this.channelFuture = channel.newSucceededFuture();
        process.getEventLoop().getEventLoopGroup().register(channel);
        this.type = Type.OUTPUT;
    }

    @Override
    public void readStart() {
        if (this.type == Type.OUTPUT) {
            return;
        }
        super.readStart();
    }

    @Override
    public void readStop() {
        if (this.type == Type.OUTPUT) {
            return;
        }
        super.readStop();
    }
}
