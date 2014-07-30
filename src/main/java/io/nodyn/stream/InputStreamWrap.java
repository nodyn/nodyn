package io.nodyn.stream;

import io.netty.channel.Channel;
import io.netty.channel.EventLoopGroup;
import io.nodyn.EventSource;
import io.nodyn.http.DebugHandler;
import io.nodyn.loop.ManagedEventLoopGroup;
import io.nodyn.loop.RefEvents;
import io.nodyn.net.ErrorHandler;
import io.nodyn.netty.pipe.NioInputStreamChannel;

import java.io.*;

/**
 * @author Bob McWhirter
 */
public class InputStreamWrap extends StreamWrapper {

    private final InputStream in;

    public InputStreamWrap(ManagedEventLoopGroup managedLoop, InputStream in) throws IOException {
        super(managedLoop);
        this.in = in;
    }

    public void start() throws IOException {
        EventLoopGroup eventLoopGroup = getManagedLoop().getEventLoopGroup();
        Channel channel = NioInputStreamChannel.create(this.in);
        setChannel(channel);
        //channel.pipeline().addLast(new DebugHandler("in"));
        channel.pipeline().addLast(new StreamEventsHandler(this));
        channel.pipeline().addLast(new ErrorHandler());
        channel.pipeline().addLast(getManagedLoop().newHandle().handler());
        channel.config().setAutoRead(false);
        eventLoopGroup.register(channel);
        channel.read();
    }

    public void readStart() {
        ref();
        getChannel().config().setAutoRead(true);
    }

    public void readStop() {
        getChannel().config().setAutoRead(false);
        unref();
    }

}
