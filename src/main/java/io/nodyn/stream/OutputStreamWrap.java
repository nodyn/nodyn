package io.nodyn.stream;

import io.netty.buffer.ByteBuf;
import io.netty.channel.Channel;
import io.netty.channel.EventLoopGroup;
import io.nodyn.loop.ManagedEventLoopGroup;
import io.nodyn.netty.pipe.NioOutputStreamChannel;

import java.io.IOException;
import java.io.OutputStream;
import java.nio.charset.Charset;

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
    public void start() throws IOException, InterruptedException {
        EventLoopGroup eventLoopGroup = getManagedLoop().getEventLoopGroup();
        Channel channel = NioOutputStreamChannel.create(this.out);
        this.setChannel(channel);
        channel.pipeline().addLast(new StreamEventsHandler(this));
        //channel.pipeline().addLast(getManagedLoop().newHandle().handler());
        channel.config().setAutoRead(false);
        eventLoopGroup.register(channel).sync();
    }

    public void write(ByteBuf chunk) throws IOException {
        getChannel().writeAndFlush( chunk );
    }

    public void write(String chunk, String encoding) throws IOException {
        byte[] bytes = chunk.getBytes( encoding );
        ByteBuf buffer = getChannel().alloc().buffer(bytes.length);
        buffer.writeBytes(bytes);
        write( buffer );
    }

}
