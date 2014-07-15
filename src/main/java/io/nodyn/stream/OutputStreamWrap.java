package io.nodyn.stream;

import io.netty.channel.Channel;
import io.netty.channel.EventLoopGroup;
import io.nodyn.loop.ManagedEventLoopGroup;
import io.nodyn.netty.pipe.NioOutputStreamChannel;

import java.io.*;

/**
 * @author Lance Ball
 */
public class OutputStreamWrap extends StreamWrapper {

    private final OutputStream out;

    public OutputStreamWrap(ManagedEventLoopGroup managedLoop, OutputStream out) throws IOException {
        super(managedLoop);
        this.out = out;
    }

    @Override
    public void start() throws IOException {
        EventLoopGroup eventLoopGroup = getManagedLoop().getEventLoopGroup();
        Channel channel = NioOutputStreamChannel.create(this.out);
        this.setChannel(channel);
        channel.pipeline().addLast(new StreamEventsHandler(this));
        channel.pipeline().addLast( getManagedLoop().newHandle().handler() );
        channel.config().setAutoRead(false);
        eventLoopGroup.register(channel);
        channel.read();
    }

    public void write(String chunk) throws IOException {
        out.write(chunk.getBytes());
    }

}
