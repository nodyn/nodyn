package io.nodyn.stream;

import io.netty.channel.Channel;
import io.nodyn.EventSource;
import io.nodyn.loop.ManagedEventLoopGroup;
import io.nodyn.loop.RefEvents;

import java.io.Closeable;
import java.io.FileDescriptor;
import java.io.FileOutputStream;
import java.io.IOException;

/**
 * @author Lance Ball
 */
public abstract class StreamWrapper extends EventSource implements Closeable {
    private final ManagedEventLoopGroup managedLoop;
    private Channel channel;

    public StreamWrapper(ManagedEventLoopGroup managedLoop) {
        this.managedLoop = managedLoop;
    }

    public abstract void start() throws IOException;

    public abstract FileDescriptor getFD() throws IOException;

    public void ref() {
        this.getChannel().pipeline().fireUserEventTriggered(RefEvents.REF);
    }

    public void unref() {
        this.getChannel().pipeline().fireUserEventTriggered(RefEvents.UNREF);
    }

    public void destroy() {
        this.getChannel().close();
    }

    public boolean isTTY() throws IOException {
        FileDescriptor fd = this.getFD();
        if (fd != null) {
            return (fd == FileDescriptor.in
                    || fd == FileDescriptor.out
                    || fd == FileDescriptor.err);
        }
        return false;
    }

    @Override
    public void close() throws IOException {
        destroy();
    }

    ManagedEventLoopGroup getManagedLoop() {
        return managedLoop;
    }

    Channel getChannel() {
        return channel;
    }

    void setChannel(Channel channel) {
        this.channel = channel;
    }
}
