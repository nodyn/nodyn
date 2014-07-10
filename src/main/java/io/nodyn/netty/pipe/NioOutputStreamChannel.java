package io.nodyn.netty.pipe;

import io.netty.buffer.ByteBuf;
import io.netty.channel.ChannelConfig;
import io.netty.channel.ChannelMetadata;
import io.netty.channel.DefaultChannelConfig;
import io.netty.channel.FileRegion;
import io.netty.channel.nio.AbstractNioByteChannel;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.SocketAddress;
import java.nio.ByteBuffer;
import java.nio.channels.Pipe;

/**
 * @author Bob McWhirter
 */
public class NioOutputStreamChannel extends AbstractNioStreamChannel {

    private final OutputStream out;

    public static NioOutputStreamChannel create(OutputStream out) throws IOException {
        Pipe pipe = Pipe.open();
        return new NioOutputStreamChannel(out, pipe);
    }

    protected NioOutputStreamChannel(OutputStream out, Pipe pipe) {
        super(pipe);
        this.out = out;
        startPump();
    }

    @Override
    protected Pipe.SinkChannel javaChannel() {
        return (Pipe.SinkChannel) super.javaChannel();
    }

    protected void startPump() {
        new Thread() {
            @Override
            public void run() {
                ByteBuffer buf = ByteBuffer.allocateDirect( 1024 );
                int numRead = 0;
                try {
                    while ( ( numRead = NioOutputStreamChannel.this.pipe.source().read( buf ) ) >= 0 ) {
                        NioOutputStreamChannel.this.out.write( buf.array(), 0, numRead );
                        buf.reset();
                    }
                } catch (IOException e) {
                    try {
                        NioOutputStreamChannel.this.pipe.source().close();
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
        return 0;
    }

    @Override
    protected int doWriteBytes(ByteBuf buf) throws Exception {
        final int expectedWrittenBytes = buf.readableBytes();
        final int writtenBytes = buf.readBytes(javaChannel(), expectedWrittenBytes);
        return writtenBytes;
    }

    @Override
    protected void doClose() throws Exception {
        this.pipe.source().close();
    }

    public boolean isActive() {
        return this.pipe.source().isOpen();
    }

}
