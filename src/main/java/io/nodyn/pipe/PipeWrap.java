package io.nodyn.pipe;

import io.netty.buffer.ByteBuf;
import io.netty.channel.ChannelOption;
import io.nodyn.NodeProcess;
import io.nodyn.fs.UnsafeFs;
import io.nodyn.netty.DataEventHandler;
import io.nodyn.netty.EOFEventHandler;
import io.nodyn.netty.pipe.NioDuplexStreamChannel;
import io.nodyn.netty.pipe.NioInputStreamChannel;
import io.nodyn.netty.pipe.NioOutputStreamChannel;
import io.nodyn.netty.pipe.ipc.DuplexIPCChannel;
import io.nodyn.netty.pipe.ipc.IPCRecord;
import io.nodyn.stream.StreamWrap;
import jnr.constants.platform.AddressFamily;
import jnr.constants.platform.Sock;

import java.io.FileDescriptor;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.nio.charset.StandardCharsets;

/**
 * @author Bob McWhirter
 */
public class PipeWrap extends StreamWrap {

    private static enum Type {
        INPUT,
        OUTPUT,
        DUPLEX,
    }

    private static final int UPSTREAM = 0;
    private static final int DOWNSTREAM = 1;

    private final boolean ipc;
    private Type type;
    private final int[] fileDescriptors = new int[2];


    public PipeWrap(NodeProcess process, boolean ipc) throws NoSuchFieldException, IllegalAccessException, IOException {
        super(process, true);
        this.ipc = ipc;
    }

    public String toString() {
        if (this.fileDescriptors == null) {
            return "[PipeWrap: " + System.identityHashCode(this) + " ipc=" + ipc + "; type=" + type + "]";
        } else {
            return "[PipeWrap: " + System.identityHashCode(this) + " ipc=" + ipc + "; type=" + type + "; fd[0]=" + fileDescriptors[0] + "; fd[1]=" + this.fileDescriptors[1] + "]";
        }
    }


    public void create(int downstreamFd) throws IllegalAccessException, NoSuchFieldException, IOException {
        process.getPosix().socketpair(AddressFamily.AF_UNIX.intValue(), Sock.SOCK_STREAM.intValue(), 0, this.fileDescriptors);
        boolean readable = (downstreamFd != 0);
        boolean writable = (downstreamFd != 1 && downstreamFd != 2);
        open(this.fileDescriptors[UPSTREAM], readable, writable);
    }

    public void closeDownstream() {
        process.getPosix().close(this.fileDescriptors[DOWNSTREAM]);
    }

    public int getUpstream() {
        return this.fileDescriptors[UPSTREAM];
    }

    public int getDownstream() {
        return this.fileDescriptors[DOWNSTREAM];
    }

    public void open(int fd, boolean readable, boolean writable) throws NoSuchFieldException, IllegalAccessException, IOException {
        FileDescriptor fileDesc = UnsafeFs.createFileDescriptor(fd);

        if (fd == 0) {
            openInput(fd, fileDesc);
        } else if (fd == 1 || fd == 2) {
            openOutput(fd, fileDesc);
        } else {
            if (readable && writable) {
                openDuplex(fd, fileDesc);
            } else if (readable) {
                openInput(fd, fileDesc);
            } else {
                openOutput(fd, fileDesc);
            }
        }
    }

    protected void openInput(int fd, FileDescriptor fileDescriptor) throws IOException {
        FileInputStream in = new FileInputStream(fileDescriptor);

        NioInputStreamChannel nioChannel = NioInputStreamChannel.create(this.process, in);
        nioChannel.config().setAutoRead(false);

        //nioChannel.pipeline().addLast("debug", new DebugHandler("input:" + fd + " // " + process.getPosix().getpid()));
        nioChannel.pipeline().addLast("emit.data", new DataEventHandler(this.process, this));
        nioChannel.pipeline().addLast("emit.eof", new EOFEventHandler(this.process, this));
        this.channelFuture = nioChannel.newSucceededFuture();
        process.getEventLoop().getEventLoopGroup().register(nioChannel);

        this.type = Type.INPUT;
    }

    public void writeUtf8String(String data, int fd) {
        ByteBuf buffer = this.channelFuture.channel().alloc().buffer();
        buffer.writeBytes(data.getBytes(StandardCharsets.UTF_8));
        this.channelFuture.channel().writeAndFlush(new IPCRecord(buffer, fd));
    }

    protected void openOutput(int fd, FileDescriptor fileDescriptor) throws IOException {
        FileOutputStream out = new FileOutputStream(fileDescriptor);

        NioOutputStreamChannel nioChannel = NioOutputStreamChannel.create(this.process, out);
        nioChannel.config().setAutoRead(false);
        this.channelFuture = nioChannel.newSucceededFuture();
        //nioChannel.pipeline().addLast("debug", new DebugHandler("output:" + fd + " // " + process.getPosix().getpid()));
        process.getEventLoop().getEventLoopGroup().register(nioChannel);

        this.type = Type.OUTPUT;
    }

    protected void openDuplex(int fd, FileDescriptor fileDescriptor) throws NoSuchFieldException, IllegalAccessException, IOException {
        if (this.ipc) {
            DuplexIPCChannel channel = new DuplexIPCChannel(this, process.getPosix(), fd);
            //channel.pipeline().addLast("debug", new DebugHandler("ipc"));
            this.channelFuture = channel.newSucceededFuture();
            process.getEventLoop().getEventLoopGroup().register(channel);
        } else {
            FileInputStream in = new FileInputStream(fileDescriptor);
            FileOutputStream out = new FileOutputStream(fileDescriptor);

            NioDuplexStreamChannel nioChannel = NioDuplexStreamChannel.create(this.process, in, out);
            nioChannel.config().setAutoRead(false);
            nioChannel.config().setOption(ChannelOption.ALLOW_HALF_CLOSURE, true);

            //nioChannel.pipeline().addLast("debug", new DebugHandler("duplex:" + fd + " // " + process.getPosix().getpid()));
            nioChannel.pipeline().addLast("emit.data", new DataEventHandler(this.process, this));
            nioChannel.pipeline().addLast("emit.eof", new EOFEventHandler(this.process, this));
            this.channelFuture = nioChannel.newSucceededFuture();
            process.getEventLoop().getEventLoopGroup().register(nioChannel);
        }

        this.type = Type.DUPLEX;
    }

    @Override
    public void readStart() {
        if (this.type != Type.OUTPUT) {
            super.readStart();
        }
    }

    @Override
    public void readStop() {
        if (this.type != Type.OUTPUT) {
            super.readStop();
        }
    }
}
