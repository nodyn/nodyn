package io.nodyn.pipe;

import io.nodyn.NodeProcess;
import io.nodyn.fs.UnsafeFs;
import io.nodyn.netty.DataEventHandler;
import io.nodyn.netty.DebugHandler;
import io.nodyn.netty.EOFEventHandler;
import io.nodyn.netty.pipe.NioInputStreamChannel;
import io.nodyn.netty.pipe.NioOutputStreamChannel;
import io.nodyn.stream.StreamWrap;

import java.io.FileDescriptor;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;

/**
 * @author Bob McWhirter
 */
public class PipeWrap extends StreamWrap {

    private static final int READER = 0;
    private static final int WRITER = 1;

    private int type;
    private int[] fileDescriptors = new int[2];

    public PipeWrap(NodeProcess process) throws NoSuchFieldException, IllegalAccessException, IOException {
        super(process, true);
        process.getPosix().pipe(this.fileDescriptors);
    }

    public int getReader() {
        return this.fileDescriptors[READER];
    }

    public int getWriter() {
        return this.fileDescriptors[WRITER];
    }

    public void becomeReader() throws NoSuchFieldException, IllegalAccessException, IOException {
        this.type = READER;

        FileDescriptor readerFileDesc = UnsafeFs.createFileDescriptor(this.fileDescriptors[READER]);
        FileInputStream reader = new FileInputStream( readerFileDesc );
        NioInputStreamChannel nioReader = NioInputStreamChannel.create( reader );

        nioReader.config().setAutoRead(false);
        //nioReader.pipeline().addLast("debug", new DebugHandler("reader"));
        nioReader.pipeline().addLast("emit.data", new DataEventHandler(this.process, this));
        nioReader.pipeline().addLast("emit.eof", new EOFEventHandler(this.process, this));
        this.channelFuture = nioReader.newSucceededFuture();
        process.getEventLoop().getEventLoopGroup().register(nioReader);
    }

    public void shutdownReader() {
        this.process.getPosix().close(this.fileDescriptors[READER]);
    }

    public void becomeWriter() throws Exception {
        this.type = WRITER;

        FileDescriptor writerFileDesc = UnsafeFs.createFileDescriptor(this.fileDescriptors[WRITER]);
        FileOutputStream writer = new FileOutputStream(writerFileDesc);
        NioOutputStreamChannel nioWriter = NioOutputStreamChannel.create(writer);

        nioWriter.config().setAutoRead(false);
        //nioWriter.pipeline().addLast("debug", new DebugHandler("writer"));
        this.channelFuture = nioWriter.newSucceededFuture();
        process.getEventLoop().getEventLoopGroup().register(nioWriter);
    }

    public void shutdownWriter() {
        this.process.getPosix().close(this.fileDescriptors[WRITER]);
    }

    @Override
    public void readStart() {
        if (this.type == READER) {
            super.readStart();
        }
    }

    @Override
    public void readStop() {
        if (this.type == READER) {
            super.readStop();
        }
    }
}
