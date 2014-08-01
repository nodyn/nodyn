package io.nodyn.stream;

import io.netty.buffer.ByteBuf;
import io.netty.channel.ChannelFuture;
import io.nodyn.handle.HandleWrap;
import io.nodyn.process.NodeProcess;

import java.io.IOException;

/**
 * @author Bob McWhirter
 */
public class StreamWrap extends HandleWrap {

    protected ChannelFuture channelFuture;

    public StreamWrap(NodeProcess process) {
        super(process);
    }

    public StreamWrap(NodeProcess process, ChannelFuture channelFuture) {
        super(process);
        this.channelFuture = channelFuture;
    }

    public void readStart() {
        this.channelFuture.channel().config().setAutoRead(true);
        this.channelFuture.channel().read();
    }

    public void readStop() {
        this.channelFuture.channel().config().setAutoRead(false);
    }

    public void write(ByteBuf buf) throws IOException {
        this.channelFuture.channel().writeAndFlush( buf );
    }

    public void writeUtf8String(String str) throws IOException {
        ByteBuf buf = this.channelFuture.channel().alloc().buffer();
        buf.writeBytes( str.getBytes( "utf8" ));
        write( buf );
    }

}
