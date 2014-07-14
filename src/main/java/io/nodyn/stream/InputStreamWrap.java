package io.nodyn.stream;

import io.netty.channel.Channel;
import io.nodyn.EventSource;
import io.nodyn.http.DebugHandler;
import io.nodyn.net.RefHandleHandler;
import io.nodyn.netty.ManagedEventLoopGroup;
import io.nodyn.netty.RefCountedEventLoopGroup;
import io.nodyn.netty.pipe.NioInputStreamChannel;

import java.io.IOException;
import java.io.InputStream;

/**
 * @author Bob McWhirter
 */
public class InputStreamWrap extends EventSource {

    private final ManagedEventLoopGroup managedLoop;
    private final InputStream in;
    private Channel channel;

    public InputStreamWrap(ManagedEventLoopGroup managedLoop, InputStream in) throws IOException {
        this.managedLoop = managedLoop;
        this.in = in;
    }

    public void start() throws IOException {
        RefCountedEventLoopGroup eventLoopGroup = managedLoop.getEventLoopGroup();
        this.channel = NioInputStreamChannel.create(this.in);
        //channel.pipeline().addLast(new DebugHandler("pipe"));
        channel.pipeline().addLast(new StreamEventsHandler(this));
        channel.pipeline().addLast(new RefHandleHandler(eventLoopGroup.refHandle()));
        channel.config().setAutoRead(false);
        eventLoopGroup.register(channel);
        channel.read();
    }

    public void readStart() {
        this.channel.config().setAutoRead(true);
    }

    public void readStop() {
        this.channel.config().setAutoRead(false);
    }

    public void destroy() {
        System.err.println( "CLOSING: " + this );
        this.channel.close();
    }
}
