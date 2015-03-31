package io.nodyn.udp;

import io.netty.buffer.ByteBuf;
import io.netty.channel.ChannelHandlerContext;
import io.netty.channel.SimpleChannelInboundHandler;
import io.netty.channel.socket.DatagramPacket;
import io.nodyn.CallbackResult;
import java.nio.ByteBuffer;

/**
 * @author Lance Ball
 */
class DatagramInboundHandler extends SimpleChannelInboundHandler<DatagramPacket> {
    private final UDPWrap udpWrap;

    public DatagramInboundHandler(UDPWrap udpWrap) {
        this.udpWrap = udpWrap;
    }

    @Override
    protected void channelRead0(ChannelHandlerContext channelHandlerContext, DatagramPacket datagramPacket) throws Exception {
        // emit message received for JS side
        final ByteBuf content = datagramPacket.content();
        final byte[] arr = new byte[content.readableBytes()];
        content.readBytes(arr);
        final ByteBuffer buf = ByteBuffer.wrap(arr);
        buf.position(arr.length);
        udpWrap.emit("recv", CallbackResult.createSuccess(buf));
    }
}
