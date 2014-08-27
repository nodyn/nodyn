package io.nodyn.udp;

import io.netty.buffer.ByteBuf;
import io.netty.channel.ChannelHandlerContext;
import io.netty.channel.SimpleChannelInboundHandler;
import io.netty.channel.socket.DatagramPacket;
import io.nodyn.CallbackResult;

import java.net.SocketAddress;

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
        // TODO: Netty only lets us mess with the buffer in JS space if we copy it. Why?
        ByteBuf buf = datagramPacket.content();
        udpWrap.emit("recv", CallbackResult.createSuccess(buf.copy()));
    }
}
