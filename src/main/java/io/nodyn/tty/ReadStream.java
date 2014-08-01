package io.nodyn.tty;

import io.netty.channel.Channel;
import io.netty.channel.ChannelFuture;
import io.netty.channel.EventLoopGroup;
import io.nodyn.net.ErrorHandler;
import io.nodyn.netty.pipe.NioInputStreamChannel;
import io.nodyn.process.NodeProcess;
import io.nodyn.stream.StreamEventsHandler;
import io.nodyn.stream.StreamWrap;
import io.nodyn.tcp.DataEventHandler;

import java.io.IOException;
import java.io.InputStream;

/**
 * @author Bob McWhirter
 */
public class ReadStream {

    public static ChannelFuture create(NodeProcess process, int fd, StreamWrap handle) throws IOException {
        if (fd == 0) {
            InputStream in = System.in;
            EventLoopGroup eventLoopGroup = process.getEventLoop().getEventLoopGroup();

            Channel channel = NioInputStreamChannel.create(in);
            channel.config().setAutoRead(false);
            channel.pipeline().addLast( new DataEventHandler( process, handle ) );
            eventLoopGroup.register(channel);

            return channel.newSucceededFuture();
        }

        return null;
    }
}
