package io.nodyn.tty;

import io.netty.channel.Channel;
import io.netty.channel.ChannelFuture;
import io.netty.channel.EventLoopGroup;
import io.nodyn.netty.pipe.NioOutputStreamChannel;
import io.nodyn.process.NodeProcess;
import io.nodyn.stream.StreamEventsHandler;
import io.nodyn.stream.StreamWrap;
import io.nodyn.tcp.DataEventHandler;

import java.io.IOException;
import java.io.OutputStream;

/**
 * @author Bob McWhirter
 */
public class WriteStream {

    public static ChannelFuture create(NodeProcess process, int fd, StreamWrap handle) throws IOException {
        OutputStream out = null;
        if ( fd == 1 ) {
            out = System.out;
        } else if ( fd == 2 ) {
            out = System.err;
        } else {
            return null;
        }

        EventLoopGroup eventLoopGroup = process.getEventLoop().getEventLoopGroup();
        Channel channel = NioOutputStreamChannel.create(out);
        channel.config().setAutoRead(false);
        channel.pipeline().addLast( new DataEventHandler( process, handle ));
        eventLoopGroup.register(channel);

        return channel.newSucceededFuture();
    }
}
