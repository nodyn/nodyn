package io.nodyn.stream;

import io.netty.buffer.ByteBuf;
import io.netty.channel.ChannelFuture;
import io.netty.channel.ChannelFutureListener;
import io.nodyn.handle.HandleWrap;
import io.nodyn.NodeProcess;

import java.io.IOException;

/**
 * @author Bob McWhirter
 */
public class StreamWrap extends HandleWrap {

    protected ChannelFuture channelFuture;

    public StreamWrap(NodeProcess process, boolean count) {
        super(process, count);
    }

    public StreamWrap(NodeProcess process, ChannelFuture channelFuture) {
        super(process, true);
        this.channelFuture = channelFuture;
    }

    public void readStart() {
        this.channelFuture.channel().config().setAutoRead(true);
        this.channelFuture.channel().read();
    }

    public void readStop() {
        this.channelFuture.channel().config().setAutoRead(false);
    }

    public void close() {
        if (this.channelFuture != null && this.channelFuture.channel() != null) {
            this.channelFuture.addListener(ChannelFutureListener.CLOSE);
        }
        super.close();
    }

    public void shutdown() {
    }

    public void write(ByteBuf buf) throws IOException {
        this.channelFuture.channel().writeAndFlush(buf.retain());
    }

    public void writeUtf8String(String str) throws IOException {
        ByteBuf buf = this.channelFuture.channel().alloc().buffer();
        buf.writeBytes(str.getBytes("utf8"));
        write(buf);
    }

    public void writeAsciiString(String str) throws IOException {
        ByteBuf buf = this.channelFuture.channel().alloc().buffer();
        buf.writeBytes(str.getBytes("us-ascii"));
        write(buf);
    }

}
