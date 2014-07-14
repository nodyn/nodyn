package io.nodyn.netty.pipe;

import io.netty.buffer.ByteBuf;
import io.netty.channel.*;
import io.netty.channel.nio.AbstractNioByteChannel;
import io.netty.channel.nio.AbstractNioChannel;

import java.io.IOException;
import java.io.InputStream;
import java.net.SocketAddress;
import java.nio.ByteBuffer;
import java.nio.channels.Pipe;
import java.nio.channels.SelectableChannel;

/**
 * @author Bob McWhirter
 */
public class NioInputStreamChannel extends AbstractNioStreamChannel {

    private final InputStream in;

    public static NioInputStreamChannel create(InputStream in) throws IOException {
        Pipe pipe = Pipe.open();
        return new NioInputStreamChannel(in, pipe);
    }

    protected NioInputStreamChannel(InputStream in, Pipe pipe) {
        super(pipe);
        this.in = in;
        startPump();
    }

    @Override
    protected Pipe.SourceChannel javaChannel() {
        return (Pipe.SourceChannel) super.javaChannel();
    }

    protected void startPump() {
        new Thread() {
            @Override
            public void run() {
                byte[] buf = new byte[1024];
                int numRead = 0;
                try {
                    while ((numRead = NioInputStreamChannel.this.in.read(buf)) >= 0) {
                        NioInputStreamChannel.this.pipe.sink().write(ByteBuffer.wrap(buf, 0, numRead));
                    }
                    NioInputStreamChannel.this.pipe.sink().close();
                } catch (IOException e) {
                    try {
                        NioInputStreamChannel.this.pipe.sink().close();
                    } catch (IOException e1) {
                        //e1.printStackTrace();
                    }
                }
            }
        }.start();
    }

    @Override
    protected long doWriteFileRegion(FileRegion region) throws Exception {
        return 0;
    }

    @Override
    protected int doReadBytes(ByteBuf byteBuf) throws Exception {
        return byteBuf.writeBytes(javaChannel(), byteBuf.writableBytes());
    }

    @Override
    protected int doWriteBytes(ByteBuf buf) throws Exception {
        return 0;
    }

    @Override
    protected void doClose() throws Exception {
        this.pipe.source().close();
    }


    @Override
    public boolean isActive() {
        return this.pipe.source().isOpen();
    }

}
