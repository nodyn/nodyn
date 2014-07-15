package io.nodyn.stream;

import io.netty.channel.Channel;
import io.netty.channel.EventLoopGroup;
import io.nodyn.EventSource;
import io.nodyn.http.DebugHandler;
import io.nodyn.loop.ManagedEventLoopGroup;
import io.nodyn.loop.RefEvents;
import io.nodyn.net.ErrorHandler;
import io.nodyn.netty.pipe.NioInputStreamChannel;

import java.io.Closeable;
import java.io.IOException;
import java.io.InputStream;

/**
 * @author Bob McWhirter
 */
public class InputStreamWrap extends EventSource implements Closeable {

    private final ManagedEventLoopGroup managedLoop;
    private final InputStream in;
    private Channel channel;

    public InputStreamWrap(ManagedEventLoopGroup managedLoop, InputStream in) throws IOException {
        this.managedLoop = managedLoop;
        this.in = in;
    }

    public void start() throws IOException {
        EventLoopGroup eventLoopGroup = managedLoop.getEventLoopGroup();
        this.channel = NioInputStreamChannel.create(this.in);
        //channel.pipeline().addLast(new DebugHandler("pipe"));
        channel.pipeline().addLast(new StreamEventsHandler(this));
        channel.pipeline().addLast( managedLoop.newHandle().handler() );
        channel.pipeline().addLast( new ErrorHandler() );
        channel.config().setAutoRead(false);
        eventLoopGroup.register(channel);
        channel.read();
    }

    public void readStart() {
        ref();
        this.channel.config().setAutoRead(true);
    }

    public void readStop() {
        this.channel.config().setAutoRead(false);
        unref();
    }

    public void ref() {
        this.channel.pipeline().fireUserEventTriggered(RefEvents.REF);
    }

    public void unref() {
        this.channel.pipeline().fireUserEventTriggered(RefEvents.UNREF);
    }

    public void destroy() {
        this.channel.close();
    }

    @Override
    public void close() throws IOException {
        destroy();
    }
}
